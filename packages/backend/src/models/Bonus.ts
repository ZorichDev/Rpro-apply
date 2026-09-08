import { Schema, model, Document, Types } from "mongoose";
import { BONUS_STATUS, BonusStatus } from "shared";

export interface IBonus extends Document {
  partnerId: Types.ObjectId;
  studentId: Types.ObjectId;
  applicationId: Types.ObjectId;
  type: "study_abroad";
  amountNgn: number;
  status: BonusStatus;
  paidAt?: Date;
  createdAt: Date;
}

const bonusSchema = new Schema<IBonus>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true, unique: true },
    type: { type: String, enum: ["study_abroad"], default: "study_abroad" },
    amountNgn: { type: Number, required: true },
    status: { type: String, enum: Object.values(BONUS_STATUS), default: BONUS_STATUS.PENDING },
    paidAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Bonus = model<IBonus>("Bonus", bonusSchema);
