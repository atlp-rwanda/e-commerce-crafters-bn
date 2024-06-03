import { Request, Response } from 'express';
import Notification from '../database/models/notification';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vendorId } = req.params;
    const notifications = await Notification.findAll({ where: { vendorId } });
      if (notifications.length === 0) {
      res.status(404).json({
        message: 'No notifications that were found',
      });
      return;
    }
    res.status(200).json({ notifications: notifications });
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isRead } = req.body;
  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      res.status(401).json({
        errorMessage: 'No notification found',
      });
      return;
    }
    notification.isRead = isRead;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read successfully' });
  } catch (error) {
     console.error(`Error occurred: ${error}`);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

export async function addNotification(vendorId: string, message: string): Promise<void> {
    await Notification.create({ vendorId, message, createdAt: new Date(), isRead: false });
}
