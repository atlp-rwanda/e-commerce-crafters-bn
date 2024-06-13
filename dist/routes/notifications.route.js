"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("../controllers/notifications.controller");
const router = (0, express_1.Router)();
router.get('/notifications/:vendorId', notifications_controller_1.getNotifications);
router.patch('/readnotifications/:id', notifications_controller_1.markNotificationAsRead);
exports.default = router;
