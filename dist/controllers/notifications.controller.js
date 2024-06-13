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
exports.addNotification = exports.markNotificationAsRead = exports.getNotifications = void 0;
const notification_1 = __importDefault(require("../database/models/notification"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.vendorId;
        const notifications = yield notification_1.default.findAll({ where: { vendorId } });
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications that were found' });
        }
        res.status(200).json({ notifications });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
});
exports.getNotifications = getNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = req.params.id;
        const notification = yield notification_1.default.findByPk(notificationId);
        if (!notification) {
            return res.status(401).json({ errorMessage: 'No notification found' });
        }
        notification.isRead = true;
        yield notification.save();
        res.status(200).json({ message: 'Notification marked as read successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
function addNotification(vendorId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield notification_1.default.create({ vendorId, message, createdAt: new Date(), isRead: false });
    });
}
exports.addNotification = addNotification;
