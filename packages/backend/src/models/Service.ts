import { Schema, model, Document, Types } from "mongoose";
import { SERVICE_CATEGORIES, ServiceCategory, CURRENCIES, Currency } from "shared";

export interface IService extends Document {
  vendorId: Types.ObjectId;
  title: string;
  category: ServiceCategory;
  description?: string;
  priceAmount: number;
  currency: Currency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: SERVICE_CATEGORIES, required: true },
    description: { type: String, maxlength: 1000 },
    priceAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
