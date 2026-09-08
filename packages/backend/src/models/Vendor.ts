import { Schema } from "mongoose";
import { ROLES, SERVICE_CATEGORIES } from "shared";
import { User } from "./User";

const vendorSchema = new Schema({
  companyName: { type: String, trim: true },
  serviceCategory: {
    type: String,
    enum: SERVICE_CATEGORIES,
  },
});

export const Vendor = User.discriminator(ROLES.VENDOR, vendorSchema);
