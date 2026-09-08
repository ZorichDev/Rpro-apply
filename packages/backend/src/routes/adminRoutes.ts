import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  listUsers,
  listInstitutions,
  verifyInstitution,
  getStats,
  suspendUser,
  unsuspendUser,
  removeUser,
  listAuditLog,
  listPartnerEarnings,
  listPaidOrders,
  setOrderSelfClose,
  listBonuses,
  markBonusPaid,
} from "../controllers/adminController";

const router = Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get("/stats", getStats);
router.get("/users", listUsers);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/unsuspend", unsuspendUser);
router.delete("/users/:id", removeUser);
router.get("/institutions", listInstitutions);
router.patch("/institutions/:id/verify", verifyInstitution);
router.get("/audit-log", listAuditLog);
router.get("/partners", listPartnerEarnings);
router.get("/orders", listPaidOrders);
router.patch("/orders/:id/self-close", setOrderSelfClose);
router.get("/bonuses", listBonuses);
router.patch("/bonuses/:id/pay", markBonusPaid);

export default router;
