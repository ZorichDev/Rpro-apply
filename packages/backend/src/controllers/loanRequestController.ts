import { Response, NextFunction } from "express";
import { createLoanRequestSchema, decideLoanRequestSchema } from "shared";
import { LoanRequest } from "../models/LoanRequest";
import { Service } from "../models/Service";
import type { AuthedRequest } from "../middleware/auth";

// Student-only: request a loan from a vendor's "loans"-category service.
// Distinct from Orders on purpose — a loan isn't something you pay for
// up front, it's something a lender reviews and decides on.
export async function createLoanRequest(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createLoanRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const service = await Service.findById(parsed.data.serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.category !== "loans") {
      return res.status(400).json({ message: "This service isn't a loan product" });
    }

    const loanRequest = await LoanRequest.create({
      studentId: req.user!.id,
      vendorId: service.vendorId,
      serviceId: service.id,
      amountRequested: parsed.data.amountRequested,
      currency: service.currency,
      purpose: parsed.data.purpose,
      monthlyIncome: parsed.data.monthlyIncome,
    });

    res.status(201).json({ loanRequest });
  } catch (err) {
    next(err);
  }
}

export async function listMyLoanRequests(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const loanRequests = await LoanRequest.find({ studentId: req.user!.id })
      .populate("vendorId", "companyName")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });

    res.json({ loanRequests });
  } catch (err) {
    next(err);
  }
}

// Vendor-only: loan requests submitted against their own services.
export async function listReceivedLoanRequests(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const loanRequests = await LoanRequest.find({ vendorId: req.user!.id })
      .populate("studentId", "firstName lastName email country")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });

    res.json({ loanRequests });
  } catch (err) {
    next(err);
  }
}

export async function decideLoanRequest(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = decideLoanRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const loanRequest = await LoanRequest.findOne({
      _id: req.params.id,
      vendorId: req.user!.id, // a vendor can only decide on their own loan requests
    });
    if (!loanRequest) {
      return res.status(404).json({ message: "Loan request not found" });
    }

    loanRequest.status = parsed.data.status;
    if (parsed.data.note !== undefined) {
      loanRequest.reviewNote = parsed.data.note;
    }
    loanRequest.decidedAt = new Date();
    await loanRequest.save();

    res.json({ loanRequest });
  } catch (err) {
    next(err);
  }
}
