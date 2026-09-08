import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  createOrder,
  listMyOrders,
  markOrderPaid,
  initiateCheckout,
  verifyCheckout,
  getMyEarnings,
  downloadMonthlyReport,
  getMyBonuses,
} from "../controllers/orderController";

const router = Router();

router.use(requireAuth);

// Student
router.post("/", requireRole(ROLES.STUDENT), createOrder);
router.get("/mine", requireRole(ROLES.STUDENT), listMyOrders);
router.post("/:id/checkout", requireRole(ROLES.STUDENT), initiateCheckout);
router.post("/verify", requireRole(ROLES.STUDENT), verifyCheckout);
router.post("/:id/pay", requireRole(ROLES.STUDENT), markOrderPaid);

// Recruitment partner
router.get("/earnings", requireRole(ROLES.RECRUITMENT_PARTNER), getMyEarnings);
router.get("/earnings/report", requireRole(ROLES.RECRUITMENT_PARTNER), downloadMonthlyReport);
router.get("/bonuses", requireRole(ROLES.RECRUITMENT_PARTNER), getMyBonuses);

export default router;
