"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const notification_1 = __importDefault(require("../database/models/notification"));
const sinon_1 = __importDefault(require("sinon"));
const notifications_controller_1 = require("../controllers/notifications.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/notifications/:vendorId', notifications_controller_1.getNotifications);
app.patch('/readnotifications/:id', notifications_controller_1.markNotificationAsRead);
describe('Notification Controller Tests', () => {
    let findAllNotificationsStub;
    let findByPkNotificationStub;
    let saveNotificationStub;
    beforeEach(() => {
        findAllNotificationsStub = sinon_1.default.stub(notification_1.default, 'findAll');
        findByPkNotificationStub = sinon_1.default.stub(notification_1.default, 'findByPk');
        saveNotificationStub = sinon_1.default.stub(notification_1.default.prototype, 'save');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    describe('GET /notifications/', () => {
        it('should return notifications for a vendor', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockNotifications = [
                { id: 1, vendorId: '1', message: 'Notification 1', isRead: false },
                { id: 2, vendorId: '1', message: 'Notification 2', isRead: false },
            ];
            findAllNotificationsStub.resolves(mockNotifications);
            const response = yield (0, supertest_1.default)(app).get('/notifications/1');
            expect(response.status).toBe(200);
            expect(response.body.notifications).toEqual(mockNotifications);
        }));
        it('should return 404 if no notifications found', () => __awaiter(void 0, void 0, void 0, function* () {
            findAllNotificationsStub.resolves([]);
            const response = yield (0, supertest_1.default)(app).get('/notifications/1');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No notifications that were found');
        }));
        it('should return 500 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            findAllNotificationsStub.rejects(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).get('/notifications/1');
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to retrieve notifications');
        }));
    });
    describe('PATCH /readnotifications/', () => {
        it('should mark notification as read', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockNotification = { id: 1, vendorId: '1', message: 'Notification 1', isRead: false, save: jest.fn().mockResolvedValue({}) };
            findByPkNotificationStub.resolves(mockNotification);
            const response = yield (0, supertest_1.default)(app).patch('/readnotifications/1').send({ isRead: true });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Notification marked as read successfully');
            expect(mockNotification.isRead).toBe(true);
            expect(mockNotification.save).toHaveBeenCalled();
        }));
        it('should return 401 if notification not found', () => __awaiter(void 0, void 0, void 0, function* () {
            findByPkNotificationStub.resolves(null);
            const response = yield (0, supertest_1.default)(app).patch('/readnotifications/1').send({ isRead: true });
            expect(response.status).toBe(401);
            expect(response.body.errorMessage).toBe('No notification found');
        }));
        it('should return 500 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            findByPkNotificationStub.rejects(new Error('Database error'));
            const response = yield (0, supertest_1.default)(app).patch('/readnotifications/1').send({ isRead: true });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to retrieve notifications');
        }));
    });
});
