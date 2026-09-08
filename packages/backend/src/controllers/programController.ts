import { Response, NextFunction, Request } from "express";
import { createProgramSchema } from "shared";
import { Program } from "../models/Program";
import { Institution } from "../models/Institution";
import type { AuthedRequest } from "../middleware/auth";

// Public: students (or anyone) browse active programs, with optional
// filters. No auth required — this is the discovery surface.
export async function listPrograms(req: Request, res: Response, next: NextFunction) {
  try {
    const { country, level, q } = req.query;
    const filter: Record<string, unknown> = { isActive: true };

    if (country) filter.country = country;
    if (level) filter.level = level;
    if (q) filter.title = { $regex: String(q), $options: "i" };

    const programs = await Program.find(filter)
      .populate("institutionId", "institutionName country")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ programs });
  } catch (err) {
    next(err);
  }
}

export async function getProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const program = await Program.findById(req.params.id).populate(
      "institutionId",
      "institutionName country accreditationVerified"
    );
    if (!program || !program.isActive) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ program });
  } catch (err) {
    next(err);
  }
}

// Institution-only: create a program under their own account.
export async function createProgram(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createProgramSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const institution = await Institution.findById(req.user!.id);
    if (!institution?.isProfileComplete) {
      return res.status(403).json({ message: "Complete your institution profile before listing programs" });
    }

    const program = await Program.create({
      ...parsed.data,
      institutionId: req.user!.id,
    });

    res.status(201).json({ program });
  } catch (err) {
    next(err);
  }
}

// Institution-only: list the programs they own (active and inactive).
export async function listMyPrograms(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const programs = await Program.find({ institutionId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ programs });
  } catch (err) {
    next(err);
  }
}

// Institution-only: edit a program's own details. Scoped by institutionId
// so one institution can never edit another's listing, even by guessing
// an ID.
export async function updateProgram(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createProgramSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, institutionId: req.user!.id },
      parsed.data,
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ program });
  } catch (err) {
    next(err);
  }
}

// Institution-only: take a program down (or bring it back) without
// deleting it — preserves any existing applications tied to it.
export async function setProgramActive(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { isActive } = req.body as { isActive?: boolean };
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }

    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, institutionId: req.user!.id },
      { isActive },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ program });
  } catch (err) {
    next(err);
  }
}
