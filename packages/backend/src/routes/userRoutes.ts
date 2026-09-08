import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { getMe, updateProfile, getMyReferrals } from "../controllers/userController";

const router = Router();

router.use(requireAuth);
router.get("/me", getMe);
router.patch("/me/profile", updateProfile);
router.get("/me/referrals", requireRole(ROLES.RECRUITMENT_PARTNER), getMyReferrals);

export default router;
