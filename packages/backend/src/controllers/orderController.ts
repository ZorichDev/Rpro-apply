import { Response, NextFunction } from "express";
import crypto from "crypto";
import { createOrderSchema, ORDER_STATUS } from "shared";
import { Order, IOrder } from "../models/Order";
import { Service } from "../models/Service";
import { Student } from "../models/Student";
import { Bonus } from "../models/Bonus";
import { env } from "../config/env";
import { initiateFlutterwavePayment, verifyFlutterwaveTransaction } from "../utils/flutterwave";
import type { AuthedRequest } from "../middleware/auth";

function generateTxRef(): string {
  return `RPRO-${crypto.randomBytes(8).toString("hex")}`;
}

// Shared by both the Flutterwave-verified path and the no-gateway demo
// path below — marks an order paid and realizes commission exactly once,
// so the two paths can never double-credit a partner. Commission is
// always calculated in the order's own currency, never converted. Uses
// the 10% self-close rate if admin has designated this order as such,
// otherwise the default 7% referral-only rate.
function markPaid(order: IOrder) {
  order.status = ORDER_STATUS.PAID;
  order.paidAt = new Date();
  if (order.referralPartnerId) {
    order.commissionRate = order.isSelfClose ? 0.1 : order.commissionRate;
    order.commissionAmount = Math.round(order.amount * order.commissionRate * 100) / 100;
  }
}

// Student-only: add a vendor service to their account. Creates the order
// in "pending" state with a unique tx_ref, ready to hand to Flutterwave
// at checkout. Amount and currency are copied from the service as listed
// by the vendor — never assumed or converted.
export async function createOrder(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const service = await Service.findById(parsed.data.serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }

    const student = await Student.findById(req.user!.id);

    const order = await Order.create({
      studentId: req.user!.id,
      serviceId: service.id,
      vendorId: service.vendorId,
      amount: service.priceAmount,
      currency: service.currency,
      // Attribution follows the student's own referredBy — set once at
      // their registration — not whichever partner they're transacting
      // with now.
      referralPartnerId: student?.referredBy ?? undefined,
      txRef: generateTxRef(),
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({ studentId: req.user!.id })
      .populate("serviceId", "title category")
      .populate("vendorId", "companyName")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

// Student-only: starts a real Flutterwave checkout for a pending order
// and returns the hosted payment page URL to redirect to. Will fail with
// a clear error until FLW_SECRET_KEY in .env is a real (test or live) key
// — that's expected while using the placeholder. Uses the order's own
// currency, not a single global setting — a NGN service and a KES
// service both check out correctly in their own currency.
export async function initiateCheckout(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ _id: req.params.id, studentId: req.user!.id }).populate(
      "serviceId",
      "title"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== ORDER_STATUS.PENDING) {
      return res.status(409).json({ message: "This order isn't awaiting payment" });
    }

    const serviceTitle = (order.serviceId as any)?.title ?? "R-Pro Apply service";

    const paymentLink = await initiateFlutterwavePayment({
      amount: order.amount,
      currency: order.currency,
      email: req.user!.email,
      txRef: order.txRef,
      redirectUrl: `${env.clientUrl}/orders/callback`,
      title: serviceTitle,
    });

    res.json({ paymentLink });
  } catch (err: any) {
    // Surfaces Flutterwave's own error (e.g. "Invalid authorization key")
    // rather than a generic 500, since with a placeholder key this is
    // expected to fail until a real key is set.
    res.status(502).json({ message: err.message ?? "Could not start payment" });
  }
}

// Student-only: called by the frontend's callback page after Flutterwave
// redirects back. Never trusts the redirect's own query params — always
// re-verifies the transaction against Flutterwave's API using the secret
// key before crediting anything.
export async function verifyCheckout(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { transactionId, txRef } = req.body as { transactionId?: string; txRef?: string };
    if (!transactionId || !txRef) {
      return res.status(400).json({ message: "transactionId and txRef are required" });
    }

    const order = await Order.findOne({ txRef, studentId: req.user!.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === ORDER_STATUS.PAID) {
      return res.json({ order, message: "Already confirmed" });
    }

    let transaction;
    try {
      transaction = await verifyFlutterwaveTransaction(transactionId);
    } catch (err: any) {
      return res.status(502).json({ message: err.message ?? "Could not verify payment" });
    }

    const amountMatches = transaction.amount >= order.amount;
    const refMatches = transaction.tx_ref === order.txRef;
    const currencyMatches = transaction.currency === order.currency;

    if (transaction.status !== "successful" || !amountMatches || !refMatches || !currencyMatches) {
      return res.status(400).json({ message: "Payment could not be confirmed" });
    }

    markPaid(order);
    order.flwTransactionId = transaction.id;
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// Student-only, DEMO PATH: bypasses Flutterwave entirely — kept for
// local testing without a real gateway key configured. The real flow is
// initiateCheckout + verifyCheckout above.
export async function markOrderPaid(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ _id: req.params.id, studentId: req.user!.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === ORDER_STATUS.PAID) {
      return res.status(409).json({ message: "Order already paid" });
    }

    markPaid(order);
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// Recruitment-partner-only: their commission history and running totals.
// Totals are grouped by currency — a partner whose referred students
// bought services from vendors in different countries can have earned
// commission in more than one currency, and that's shown honestly rather
// than force-converted into one number.
export async function getMyEarnings(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({
      referralPartnerId: req.user!.id,
      status: ORDER_STATUS.PAID,
    })
      .populate("studentId", "email")
      .populate("serviceId", "title")
      .sort({ paidAt: -1 });

    const totalsByCurrency: Record<string, number> = {};
    for (const o of orders) {
      totalsByCurrency[o.currency] = (totalsByCurrency[o.currency] ?? 0) + o.commissionAmount;
    }

    res.json({ orders, totalsByCurrency });
  } catch (err) {
    next(err);
  }
}

// Recruitment-partner-only: CSV export of a specific month's paid
// commission-generating orders, for reconciling a payout or resolving a
// dispute about what was actually earned that month.
export async function downloadMonthlyReport(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const month = req.query.month as string | undefined; // format: YYYY-MM
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "month query param is required, format YYYY-MM" });
    }

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);

    const orders = await Order.find({
      referralPartnerId: req.user!.id,
      status: ORDER_STATUS.PAID,
      paidAt: { $gte: start, $lt: end },
    })
      .populate("studentId", "email")
      .populate("serviceId", "title")
      .sort({ paidAt: 1 });

    const header = "Date,Student,Service,Amount,Currency,Commission Rate,Commission Amount\n";
    const rows = orders
      .map((o) => {
        const date = o.paidAt?.toISOString().slice(0, 10) ?? "";
        const student = (o.studentId as any)?.email ?? "";
        const service = (o.serviceId as any)?.title ?? "";
        return `${date},${student},"${service}",${o.amount},${o.currency},${o.commissionRate},${o.commissionAmount}`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="commission-report-${month}.csv"`);
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
}

// Recruitment-partner-only: their study-abroad success bonuses — a flat
// ₦250,000 per referred student who gets accepted, separate from the
// percentage-based service commission above.
export async function getMyBonuses(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bonuses = await Bonus.find({ partnerId: req.user!.id })
      .populate("studentId", "email")
      .sort({ createdAt: -1 });

    const totalNgn = bonuses.reduce((sum, b) => sum + b.amountNgn, 0);

    res.json({ bonuses, totalNgn });
  } catch (err) {
    next(err);
  }
}
