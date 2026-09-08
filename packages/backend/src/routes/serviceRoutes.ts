import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { listServices, createService, listMyServices } from "../controllers/serviceController";

const router = Router();

// Public discovery.
router.get("/", listServices);

// Vendor-only management.
router.get("/mine/list", requireAuth, requireRole(ROLES.VENDOR), listMyServices);
router.post("/", requireAuth, requireRole(ROLES.VENDOR), createService);

export default router;
