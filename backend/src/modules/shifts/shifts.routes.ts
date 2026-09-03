import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { create, list, getOne, update, remove } from "./shifts.controller";

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.get("/:id", getOne);
router.post("/", requireRole("MANAGER"), create);
router.put("/:id", requireRole("MANAGER"), update);
router.delete("/:id", requireRole("MANAGER"), remove);

export default router;