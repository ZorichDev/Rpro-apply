import { Response, NextFunction } from "express";
import { ROLES, ORDER_STATUS, BONUS_STATUS } from "shared";
import { User } from "../models/User";
import { Institution } from "../models/Institution";
import { Application } from "../models/Application";
import { Order } from "../models/Order";
import { Bonus } from "../models/Bonus";
import { AuditLog, AuditAction } from "../models/AuditLog";
import type { AuthedRequest } from "../middleware/auth";

async function logAction(
  actor: { id: string; email: string },
  action: AuditAction,
  target: { id: string; email: string },
  reason?: string
) {
  await AuditLog.create({
    actorId: actor.id,
    actorEmail: actor.email,
    action,
    targetId: target.id,
    targetEmail: target.email,
    reason,
  });
}

export async function listUsers(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { role, includeDeleted } = req.query;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (!includeDeleted) filter.isDeleted = { $ne: true };

    const users = await User.find(filter)
      .select("email role isVerified isProfileComplete isSuspended suspendedReason isDeleted createdAt")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// Reversible — blocks the account immediately (requireAuth checks this on
// every request), for policy violations or disputes under investigation.
export async function suspendUser(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (req.params.id === req.user!.id) {
      return res.status(400).json({ message: "You can't suspend your own account" });
    }

    const { reason } = req.body as { reason?: string };
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true, suspendedReason: reason },
      { new: true }
    ).select("email role isSuspended suspendedReason");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await logAction(req.user!, "user.suspend", { id: user.id, email: user.email }, reason);

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function unsuspendUser(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false, suspendedReason: undefined },
      { new: true }
    ).select("email role isSuspended");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await logAction(req.user!, "user.unsuspend", { id: user.id, email: user.email });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// Soft delete — deactivates the account and hides it from normal listings.
// Orders, applications, and programs tied to this user are left intact
// rather than cascaded, since deleting them would corrupt other people's
// records (e.g. an institution's history of a now-removed applicant).
export async function removeUser(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (req.params.id === req.user!.id) {
      return res.status(400).json({ message: "You can't remove your own account" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, refreshTokenHash: undefined },
      { new: true }
    ).select("email role isDeleted");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await logAction(req.user!, "user.remove", { id: user.id, email: user.email });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// Institutions pending accreditation review — the workflow the field
// existed for but nothing previously acted on.
export async function listInstitutions(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const institutions = await Institution.find()
      .select("email institutionName country institutionType accreditationVerified isProfileComplete createdAt")
      .sort({ createdAt: -1 });

    res.json({ institutions });
  } catch (err) {
    next(err);
  }
}

export async function verifyInstitution(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { accreditationVerified: true },
      { new: true }
    );
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    await logAction(req.user!, "institution.verify", { id: institution.id, email: institution.email });

    res.json({ institution });
  } catch (err) {
    next(err);
  }
}

// Chronological record of every moderation action — who did what, to
// whom, and when. Exists specifically so a suspend/remove decision can
// be traced back later, since those actions have no other trail.
export async function listAuditLog(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const [studentCount, institutionCount, vendorCount, partnerCount, applicationCount, paidOrders] =
      await Promise.all([
        User.countDocuments({ role: ROLES.STUDENT }),
        User.countDocuments({ role: ROLES.INSTITUTION }),
        User.countDocuments({ role: ROLES.VENDOR }),
        User.countDocuments({ role: ROLES.RECRUITMENT_PARTNER }),
        Application.countDocuments(),
        Order.find({ status: ORDER_STATUS.PAID }),
      ]);

    // Grouped by currency rather than summed into one number — revenue
    // and commission span multiple countries' currencies and shouldn't
    // be force-converted into a single figure.
    const revenueByCurrency: Record<string, number> = {};
    const commissionByCurrency: Record<string, number> = {};
    for (const o of paidOrders) {
      revenueByCurrency[o.currency] = (revenueByCurrency[o.currency] ?? 0) + o.amount;
      commissionByCurrency[o.currency] = (commissionByCurrency[o.currency] ?? 0) + o.commissionAmount;
    }

    res.json({
      users: {
        students: studentCount,
        institutions: institutionCount,
        vendors: vendorCount,
        partners: partnerCount,
      },
      applications: applicationCount,
      orders: {
        paid: paidOrders.length,
        revenueByCurrency,
        commissionByCurrency,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin-only: how much each recruitment partner has earned, so admin
// knows who to pay and where to send it. Grouped by currency per partner
// — a partner can have earned in more than one currency.
export async function listPartnerEarnings(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const partners = await User.find({ role: ROLES.RECRUITMENT_PARTNER, isDeleted: { $ne: true } }).select(
      "email referralCode bankName accountNumber accountName"
    );

    const paidOrders = await Order.find({
      status: ORDER_STATUS.PAID,
      referralPartnerId: { $in: partners.map((p) => p.id) },
    });

    const earningsByPartner: Record<string, Record<string, number>> = {};
    for (const o of paidOrders) {
      const partnerId = o.referralPartnerId!.toString();
      if (!earningsByPartner[partnerId]) earningsByPartner[partnerId] = {};
      earningsByPartner[partnerId][o.currency] =
        (earningsByPartner[partnerId][o.currency] ?? 0) + o.commissionAmount;
    }

    const result = partners.map((p) => ({
      id: p.id,
      email: p.email,
      referralCode: (p as any).referralCode,
      bankName: (p as any).bankName,
      accountNumber: (p as any).accountNumber,
      accountName: (p as any).accountName,
      earningsByCurrency: earningsByPartner[p.id] ?? {},
    }));

    res.json({ partners: result });
  } catch (err) {
    next(err);
  }
}

// Admin-only: every paid order that earned a partner commission, so
// admin can designate which ones were actually self-closed by the
// partner (10% tier) versus closed by company staff (7% referral-only
// default). "Closing" isn't something the system can detect on its own —
// this is a manual designation, same as any commission-tier decision a
// sales team would make by hand.
export async function listPaidOrders(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.PAID, referralPartnerId: { $ne: null } })
      .populate("studentId", "email")
      .populate("serviceId", "title")
      .populate("referralPartnerId", "email referralCode")
      .sort({ paidAt: -1 })
      .limit(200);

    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function setOrderSelfClose(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { isSelfClose } = req.body as { isSelfClose?: boolean };
    if (typeof isSelfClose !== "boolean") {
      return res.status(400).json({ message: "isSelfClose must be true or false" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isSelfClose = isSelfClose;
    // If this order was already paid, retroactively recompute its
    // commission at the new rate — admin may only realize after the fact
    // that a sale was self-closed.
    if (order.status === ORDER_STATUS.PAID && order.referralPartnerId) {
      order.commissionRate = isSelfClose ? 0.1 : 0.07;
      order.commissionAmount = Math.round(order.amount * order.commissionRate * 100) / 100;
    }
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// Admin-only: every study-abroad success bonus owed, across all
// partners, so admin knows what to pay out alongside the percentage
// commissions.
export async function listBonuses(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bonuses = await Bonus.find()
      .populate("partnerId", "email referralCode")
      .populate("studentId", "email")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ bonuses });
  } catch (err) {
    next(err);
  }
}

export async function markBonusPaid(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bonus = await Bonus.findByIdAndUpdate(
      req.params.id,
      { status: BONUS_STATUS.PAID, paidAt: new Date() },
      { new: true }
    );
    if (!bonus) {
      return res.status(404).json({ message: "Bonus not found" });
    }
    res.json({ bonus });
  } catch (err) {
    next(err);
  }
}
