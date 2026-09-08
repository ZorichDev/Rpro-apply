import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { upload } from "../config/upload";
import {
  uploadDocument,
  listMyDocuments,
  deleteDocument,
  downloadDocument,
  listStudentDocuments,
  verifyDocument,
} from "../controllers/documentController";

const router = Router();

router.use(requireAuth);

// Student
router.post("/", requireRole(ROLES.STUDENT), upload.single("file"), uploadDocument);
router.get("/mine", requireRole(ROLES.STUDENT), listMyDocuments);
router.delete("/:id", requireRole(ROLES.STUDENT), deleteDocument);

// Institution
router.get("/student/:studentId", requireRole(ROLES.INSTITUTION), listStudentDocuments);
router.patch("/:id/verify", requireRole(ROLES.INSTITUTION), verifyDocument);

// Shared — permission-checked inside the controller itself, since who's
// allowed depends on the document's owner, not just the caller's role.
router.get("/:id/download", downloadDocument);

export default router;
