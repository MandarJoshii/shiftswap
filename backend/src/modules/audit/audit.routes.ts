import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { list } from "./audit.controller";

const router = Router();

router.get("/", requireAuth, requireRole("MANAGER"), list);

export default router;