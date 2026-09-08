import { Schema, model, Document as MongooseDocument, Types } from "mongoose";
import { DOCUMENT_TYPES, DocumentType } from "shared";

export interface IStudentDocument extends MongooseDocument {
  studentId: Types.ObjectId;
  type: DocumentType;
  originalName: string;
  storedFileName: string;
  mimeType: string;
  sizeBytes: number;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
}

const studentDocumentSchema = new Schema<IStudentDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: DOCUMENT_TYPES, required: true },
    originalName: { type: String, required: true },
    // The on-disk filename (random, not the original) — never trust a
    // user-supplied filename as a path component.
    storedFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const StudentDocument = model<IStudentDocument>("StudentDocument", studentDocumentSchema);
