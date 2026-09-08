import { Router } from "express";
import { ROLES } from "shared";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  createLoanRequest,
  listMyLoanRequests,
  listReceivedLoanRequests,
  decideLoanRequest,
} from "../controllers/loanRequestController";

const router = Router();

router.use(requireAuth);

// Student
router.post("/", requireRole(ROLES.STUDENT), createLoanRequest);
router.get("/mine", requireRole(ROLES.STUDENT), listMyLoanRequests);

// Vendor
router.get("/received", requireRole(ROLES.VENDOR), listReceivedLoanRequests);
router.patch("/:id/decide", requireRole(ROLES.VENDOR), decideLoanRequest);

export default router;
