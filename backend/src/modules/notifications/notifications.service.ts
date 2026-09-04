import prisma from "../../utils/prisma";
import { AppError } from "../../utils/AppError";

export class NotificationError extends AppError {}

export async function listNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function getUnreadCount(userId: number) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markAsRead(id: number, userId: number) {
  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification) {
    throw new NotificationError("Notification not found", 404);
  }
  if (notification.userId !== userId) {
    throw new NotificationError("You cannot modify another user's notification", 403);
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: number) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}