import { Response, NextFunction, Request } from "express";
import { createServiceSchema } from "shared";
import { Service } from "../models/Service";
import { Vendor } from "../models/Vendor";
import type { AuthedRequest } from "../middleware/auth";

// Public: students browse active services, optionally filtered by category.
export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    const services = await Service.find(filter)
      .populate("vendorId", "companyName serviceCategory")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ services });
  } catch (err) {
    next(err);
  }
}

// Vendor-only: create a service listing under their own account.
export async function createService(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const vendor = await Vendor.findById(req.user!.id);
    if (!vendor?.isProfileComplete) {
      return res.status(403).json({ message: "Complete your vendor profile before listing a service" });
    }

    const service = await Service.create({ ...parsed.data, vendorId: req.user!.id });
    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
}

// Vendor-only: list the services they own.
export async function listMyServices(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const services = await Service.find({ vendorId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ services });
  } catch (err) {
    next(err);
  }
}
