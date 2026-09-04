import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { list, markRead, markAllRead } from "./notifications.controller";

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

export default router;