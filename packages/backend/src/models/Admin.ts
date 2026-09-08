import { Schema } from "mongoose";
import { ROLES } from "shared";
import { User } from "./User";

// No extra fields — an admin's identity is just the base User record.
// Deliberately has no corresponding register-controller path: admins are
// created only via the seeder script, never through public signup.
const adminSchema = new Schema({});

export const Admin = User.discriminator(ROLES.ADMIN, adminSchema);
