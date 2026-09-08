import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  createApplication,
  listMyApplications,
  listReceivedApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";

const router = Router();

router.use(requireAuth);

// Student
router.post("/", requireRole(ROLES.STUDENT), createApplication);
router.get("/mine", requireRole(ROLES.STUDENT), listMyApplications);

// Institution
router.get("/received", requireRole(ROLES.INSTITUTION), listReceivedApplications);
router.patch("/:id/status", requireRole(ROLES.INSTITUTION), updateApplicationStatus);

export default router;
