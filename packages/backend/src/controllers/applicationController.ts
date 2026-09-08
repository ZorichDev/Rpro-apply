import { Response, NextFunction } from "express";
import { createApplicationSchema, updateApplicationStatusSchema, STUDY_ABROAD_SUCCESS_BONUS_NGN, ROLES } from "shared";
import { Application } from "../models/Application";
import { Program } from "../models/Program";
import { Student } from "../models/Student";
import { Bonus } from "../models/Bonus";
import type { AuthedRequest } from "../middleware/auth";

// Student-only: submit an application to a program.
export async function createApplication(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const student = await Student.findById(req.user!.id);
    if (!student?.isProfileComplete) {
      return res.status(403).json({ message: "Complete your student profile before applying" });
    }

    const program = await Program.findById(parsed.data.programId);
    if (!program || !program.isActive) {
      return res.status(404).json({ message: "Program not found" });
    }

    const application = await Application.create({
      studentId: req.user!.id,
      programId: program.id,
      institutionId: program.institutionId,
      personalStatement: parsed.data.personalStatement,
    });

    res.status(201).json({ application });
  } catch (err: any) {
    // Duplicate application to the same program (unique index).
    if (err?.code === 11000) {
      return res.status(409).json({ message: "You've already applied to this program" });
    }
    next(err);
  }
}

// Student-only: their own application history.
export async function listMyApplications(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const applications = await Application.find({ studentId: req.user!.id })
      .populate("programId", "title level tuitionAmount currency")
      .populate("institutionId", "institutionName country")
      .sort({ submittedAt: -1 });

    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

// Institution-only: applications submitted to their programs.
export async function listReceivedApplications(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const applications = await Application.find({ institutionId: req.user!.id })
      .populate("studentId", "firstName lastName country email")
      .populate("programId", "title level")
      .sort({ submittedAt: -1 });

    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

// Institution-only: move an application forward (review, offer, accept, reject).
export async function updateApplicationStatus(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = updateApplicationStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      institutionId: req.user!.id, // an institution can only decide on its own applications
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = parsed.data.status;
    if (parsed.data.reviewNote !== undefined) {
      application.reviewNote = parsed.data.reviewNote;
    }
    if (["accepted", "rejected"].includes(parsed.data.status)) {
      application.decidedAt = new Date();
    }

    await application.save();

    // Study-abroad success bonus: a flat ₦250,000 to whichever partner
    // referred this student, paid once per acceptance — not per order,
    // and distinct from the percentage-based service commission. The
    // unique index on Bonus.applicationId is the actual guarantee against
    // double-crediting (e.g. if a status is somehow set to "accepted"
    // twice); this check just avoids a noisy duplicate-key error in the
    // common case.
    if (parsed.data.status === "accepted") {
      const student = await Student.findById(application.studentId);
      if (student?.referredBy) {
        const alreadyExists = await Bonus.exists({ applicationId: application.id });
        if (!alreadyExists) {
          try {
            await Bonus.create({
              partnerId: student.referredBy,
              studentId: student.id,
              applicationId: application.id,
              amountNgn: STUDY_ABROAD_SUCCESS_BONUS_NGN,
            });
          } catch (bonusErr: any) {
            // Duplicate key on applicationId — another request already
            // created this bonus in the tiny window between the exists()
            // check and this create(). Safe to ignore; the bonus exists.
            if (bonusErr?.code !== 11000) throw bonusErr;
          }
        }
      }
    }

    res.json({ application });
  } catch (err) {
    next(err);
  }
}
