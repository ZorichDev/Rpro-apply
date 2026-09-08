import { Schema } from "mongoose";
import { ROLES } from "shared";
import { User } from "./User";

const studentSchema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  country: { type: String },
  dateOfBirth: { type: Date },
});

export const Student = User.discriminator(ROLES.STUDENT, studentSchema);
