import { Schema } from "mongoose";
import { ROLES, INSTITUTION_TYPES } from "shared";
import { User } from "./User";

const institutionSchema = new Schema({
  institutionName: { type: String, trim: true },
  country: { type: String },
  institutionType: {
    type: String,
    enum: INSTITUTION_TYPES,
  },
  accreditationVerified: { type: Boolean, default: false },
});

export const Institution = User.discriminator(ROLES.INSTITUTION, institutionSchema);
