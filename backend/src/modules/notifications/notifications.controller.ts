import { Request, Response, NextFunction } from "express";
import { listNotifications, getUnreadCount, markAsRead, markAllAsRead } from "./notifications.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await listNotifications(req.user!.userId);
    const unreadCount = await getUnreadCount(req.user!.userId);

    res.status(200).json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const notification = await markAsRead(id, req.user!.userId);

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    await markAllAsRead(req.user!.userId);

    res.status(200).json({ success: true, data: { message: "All notifications marked as read" } });
  } catch (error) {
    next(error);
  }
}