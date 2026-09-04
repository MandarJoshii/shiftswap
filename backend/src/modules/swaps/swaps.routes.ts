import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { postForSwap, getOpenShifts, claim, list, approve, reject } from "./swaps.controller";

const router = Router();

router.use(requireAuth);

router.get("/open-shifts", getOpenShifts);
router.get("/", list);
router.post("/claim", requireRole("EMPLOYEE"), claim);
router.post("/:shiftId/post", requireRole("EMPLOYEE"), postForSwap);
router.patch("/:id/approve", requireRole("MANAGER"), approve);
router.patch("/:id/reject", requireRole("MANAGER"), reject);

export default router;