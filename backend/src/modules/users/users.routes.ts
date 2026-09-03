import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { getMe, listEmployees } from "./users.controller";

const router = Router();

router.get("/me", requireAuth, getMe);
router.get("/employees", requireAuth, requireRole("MANAGER"), listEmployees);

export default router;