import { prisma } from "../lib/prisma";

export function createNotification(data: {
  userId: number;
  message: string;
  type: string;
  link?: string;
}) {
  return prisma.notification.create({ data });
}

export function getNotificationsByUser(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export function markNotificationRead(id: number, userId: number) {
  return prisma.notification.update({
    where: { id, userId },
    data: { read: true },
  });
}

export function markAllNotificationsRead(userId: number) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
