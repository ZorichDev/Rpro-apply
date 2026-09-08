import { Schema, model, Document, Types } from "mongoose";

export type AuditAction =
  | "user.suspend"
  | "user.unsuspend"
  | "user.remove"
  | "institution.verify";

export interface IAuditLog extends Document {
  actorId: Types.ObjectId;
  actorEmail: string;
  action: AuditAction;
  targetId: Types.ObjectId;
  targetEmail: string;
  reason?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actorEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ["user.suspend", "user.unsuspend", "user.remove", "institution.verify"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetEmail: { type: String, required: true },
    reason: { type: String, maxlength: 500 },
  },
  // Only createdAt is meaningful for a log — it records when the action
  // happened, not when the record was last touched, so no updatedAt.
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
