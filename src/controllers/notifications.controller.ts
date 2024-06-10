import { Request, Response } from 'express';
import Notification from '../database/models/notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;
    const notifications = await Notification.findAll({ where: { vendorId } });

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications that were found' });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(401).json({ errorMessage: 'No notification found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
};

export async function addNotification(vendorId: string, message: string): Promise<void> {
    await Notification.create({ vendorId, message, createdAt: new Date(), isRead: false });
}
