import { Schema, model, Document, Types } from "mongoose";
import { CURRENCIES, Currency } from "shared";

export interface IProgram extends Document {
  institutionId: Types.ObjectId;
  title: string;
  level: "undergraduate" | "postgraduate" | "diploma" | "certificate";
  country: string;
  tuitionAmount: number;
  currency: Currency;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["undergraduate", "postgraduate", "diploma", "certificate"],
      required: true,
    },
    country: { type: String, required: true },
    tuitionAmount: { type: Number, required: true, min: 0 },
    // Tuition is priced in whichever currency the institution actually
    // charges in — not forced into USD or NGN regardless of country.
    currency: { type: String, enum: CURRENCIES, required: true },
    description: { type: String, maxlength: 2000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Program = model<IProgram>("Program", programSchema);
