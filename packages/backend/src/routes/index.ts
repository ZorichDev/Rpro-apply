import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import programRoutes from "./programRoutes";
import applicationRoutes from "./applicationRoutes";
import serviceRoutes from "./serviceRoutes";
import orderRoutes from "./orderRoutes";
import adminRoutes from "./adminRoutes";
import documentRoutes from "./documentRoutes";
import loanRequestRoutes from "./loanRequestRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/programs", programRoutes);
router.use("/applications", applicationRoutes);
router.use("/services", serviceRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/documents", documentRoutes);
router.use("/loan-requests", loanRequestRoutes);

export default router;
