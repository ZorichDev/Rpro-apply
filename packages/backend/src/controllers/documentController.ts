import { Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { DOCUMENT_TYPES } from "shared";
import { StudentDocument } from "../models/StudentDocument";
import { Application } from "../models/Application";
import { UPLOAD_DIR_PATH } from "../config/upload";
import type { AuthedRequest } from "../middleware/auth";

export async function uploadDocument(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { type } = req.body as { type?: string };
    if (!type || !DOCUMENT_TYPES.includes(type as any)) {
      // Clean up the file multer already wrote to disk before we knew
      // the type was invalid — otherwise orphaned files pile up.
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Invalid or missing document type" });
    }

    const document = await StudentDocument.create({
      studentId: req.user!.id,
      type,
      originalName: req.file.originalname,
      storedFileName: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
    });

    res.status(201).json({ document });
  } catch (err) {
    next(err);
  }
}

export async function listMyDocuments(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const documents = await StudentDocument.find({ studentId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (err) {
    next(err);
  }
}

export async function deleteDocument(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const document = await StudentDocument.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user!.id,
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    fs.unlink(path.join(UPLOAD_DIR_PATH, document.storedFileName), () => {});
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

// A student always owns their own documents. An institution can only see
// them if that specific student has actually applied to one of that
// institution's programs — not any institution browsing any student's
// files. An admin can see anything.
async function canAccessDocument(userId: string, role: string, studentId: string): Promise<boolean> {
  if (role === "admin") return true;
  if (role === "student") return studentId === userId;
  if (role === "institution") {
    const hasApplication = await Application.exists({ studentId, institutionId: userId });
    return Boolean(hasApplication);
  }
  return false;
}

export async function downloadDocument(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const document = await StudentDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const allowed = await canAccessDocument(req.user!.id, req.user!.role, document.studentId.toString());
    if (!allowed) {
      return res.status(403).json({ message: "Not authorized to view this document" });
    }

    const filePath = path.join(UPLOAD_DIR_PATH, document.storedFileName);
    res.download(filePath, document.originalName);
  } catch (err) {
    next(err);
  }
}

// Institution-only: every document belonging to a student who has
// applied to one of this institution's programs.
export async function listStudentDocuments(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const hasApplication = await Application.exists({
      studentId: req.params.studentId,
      institutionId: req.user!.id,
    });
    if (!hasApplication) {
      return res.status(403).json({ message: "This student hasn't applied to your institution" });
    }

    const documents = await StudentDocument.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (err) {
    next(err);
  }
}

export async function verifyDocument(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const document = await StudentDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const hasApplication = await Application.exists({
      studentId: document.studentId,
      institutionId: req.user!.id,
    });
    if (!hasApplication) {
      return res.status(403).json({ message: "This student hasn't applied to your institution" });
    }

    document.isVerified = true;
    document.verifiedBy = req.user!.id as any;
    document.verifiedAt = new Date();
    await document.save();

    res.json({ document });
  } catch (err) {
    next(err);
  }
}
