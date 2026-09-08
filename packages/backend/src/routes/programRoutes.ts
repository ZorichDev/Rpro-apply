import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  listPrograms,
  getProgram,
  createProgram,
  listMyPrograms,
  updateProgram,
  setProgramActive,
} from "../controllers/programController";

const router = Router();

// Public discovery — no auth.
router.get("/", listPrograms);
router.get("/:id", getProgram);

// Institution-only management.
router.get("/mine/list", requireAuth, requireRole(ROLES.INSTITUTION), listMyPrograms);
router.post("/", requireAuth, requireRole(ROLES.INSTITUTION), createProgram);
router.patch("/:id", requireAuth, requireRole(ROLES.INSTITUTION), updateProgram);
router.patch("/:id/active", requireAuth, requireRole(ROLES.INSTITUTION), setProgramActive);

export default router;
