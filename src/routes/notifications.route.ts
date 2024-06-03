import { Router } from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications.controller";

const router = Router();

router.get('/notifications/:vendorId', getNotifications);
router.patch('/readnotifications/:id', markNotificationAsRead);

export default router;
