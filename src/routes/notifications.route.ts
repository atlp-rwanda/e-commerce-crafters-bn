import { Router } from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

const router = Router();

router.get('/notifications/:vendorId', VerifyAccessToken, getNotifications);
router.patch('/readnotifications/:id', VerifyAccessToken, markNotificationAsRead);

export default router;
