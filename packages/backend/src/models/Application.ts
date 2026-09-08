import { Schema, model, Document, Types } from "mongoose";
import { APPLICATION_STATUS, ApplicationStatus } from "shared";

export interface IApplication extends Document {
  studentId: Types.ObjectId;
  programId: Types.ObjectId;
  institutionId: Types.ObjectId;
  personalStatement: string;
  status: ApplicationStatus;
  reviewNote?: string;
  submittedAt: Date;
  decidedAt?: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: "Program", required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    personalStatement: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SUBMITTED,
    },
    reviewNote: { type: String, maxlength: 1000 },
    submittedAt: { type: Date, default: Date.now },
    decidedAt: { type: Date },
  },
  { timestamps: true }
);

// A student can only apply to the same program once.
applicationSchema.index({ studentId: 1, programId: 1 }, { unique: true });

export const Application = model<IApplication>("Application", applicationSchema);
