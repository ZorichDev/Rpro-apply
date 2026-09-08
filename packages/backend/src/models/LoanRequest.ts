import { Schema, model, Document, Types } from "mongoose";
import { LOAN_REQUEST_STATUS, LoanRequestStatus, CURRENCIES, Currency } from "shared";

export interface ILoanRequest extends Document {
  studentId: Types.ObjectId;
  vendorId: Types.ObjectId;
  serviceId: Types.ObjectId;
  amountRequested: number;
  currency: Currency;
  purpose: string;
  monthlyIncome: number;
  status: LoanRequestStatus;
  reviewNote?: string;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const loanRequestSchema = new Schema<ILoanRequest>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    amountRequested: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, required: true },
    purpose: { type: String, required: true, maxlength: 1000 },
    monthlyIncome: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(LOAN_REQUEST_STATUS),
      default: LOAN_REQUEST_STATUS.PENDING,
    },
    reviewNote: { type: String, maxlength: 500 },
    decidedAt: { type: Date },
  },
  { timestamps: true }
);

export const LoanRequest = model<ILoanRequest>("LoanRequest", loanRequestSchema);
