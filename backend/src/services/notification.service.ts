import {
  createNotification,
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
} from "../repositories/notification.repository";

export function notify(userId: number, message: string, type: string, link?: string) {
  return createNotification({ userId, message, type, link }).catch(() => {});
}

export function getUserNotifications(userId: number) {
  return getNotificationsByUser(userId);
}

export function readNotification(id: number, userId: number) {
  return markNotificationRead(id, userId);
}

export function readAllNotifications(userId: number) {
  return markAllNotificationsRead(userId);
}
