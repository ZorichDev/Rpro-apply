import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Local disk storage — fine for development, but this will NOT survive a
// redeploy on platforms with an ephemeral filesystem (Render, Vercel,
// most container hosts wipe local disk on every deploy). Before this
// goes to production, swap this storage engine for an S3-compatible
// bucket (AWS S3, Cloudinary, Backblaze B2) — nothing else in the
// document upload/download flow needs to change, since callers only
// deal with the file's stored name, not its physical location.
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, and PNG files are allowed"));
    }
  },
});

export const UPLOAD_DIR_PATH = UPLOAD_DIR;
