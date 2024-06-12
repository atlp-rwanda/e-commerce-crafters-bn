import request from 'supertest';
import express, { Application } from 'express';
import Notification from '../database/models/notification';
import sinon from 'sinon';
import { getNotifications, markNotificationAsRead } from '../controllers/notifications.controller';

const app: Application = express();
app.use(express.json());
app.get('/notifications/:vendorId', getNotifications);
app.patch('/readnotifications/:id', markNotificationAsRead);

describe('Notification Controller Tests', () => {
  let findAllNotificationsStub: sinon.SinonStub;
  let findByPkNotificationStub: sinon.SinonStub;
  let saveNotificationStub: sinon.SinonStub;

  beforeEach(() => {
    findAllNotificationsStub = sinon.stub(Notification, 'findAll');
    findByPkNotificationStub = sinon.stub(Notification, 'findByPk');
    saveNotificationStub = sinon.stub(Notification.prototype, 'save');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /notifications/', () => {
    it('should return notifications for a vendor', async () => {
      const mockNotifications = [
        { id: 1, vendorId: '1', message: 'Notification 1', isRead: false },
        { id: 2, vendorId: '1', message: 'Notification 2', isRead: false },
      ];
      findAllNotificationsStub.resolves(mockNotifications);

      const response = await request(app).get('/notifications/1');

      expect(response.status).toBe(200);
      expect(response.body.notifications).toEqual(mockNotifications);
    });

    it('should return 404 if no notifications found', async () => {
      findAllNotificationsStub.resolves([]);

      const response = await request(app).get('/notifications/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No notifications that were found');
    });

    it('should return 500 on error', async () => {
      findAllNotificationsStub.rejects(new Error('Database error'));

      const response = await request(app).get('/notifications/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve notifications');
    });
  });

  describe('PATCH /readnotifications/', () => {
    it('should mark notification as read', async () => {
      const mockNotification = { id: 1, vendorId: '1', message: 'Notification 1', isRead: false, save: jest.fn().mockResolvedValue({}) };
      findByPkNotificationStub.resolves(mockNotification);

      const response = await request(app).patch('/readnotifications/1').send({ isRead: true });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Notification marked as read successfully');
      expect(mockNotification.isRead).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
    });

    it('should return 401 if notification not found', async () => {
      findByPkNotificationStub.resolves(null);

      const response = await request(app).patch('/readnotifications/1').send({ isRead: true });

      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toBe('No notification found');
    });

    it('should return 500 on error', async () => {
      findByPkNotificationStub.rejects(new Error('Database error'));

      const response = await request(app).patch('/readnotifications/1').send({ isRead: true });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve notifications');
    });
  });
});
