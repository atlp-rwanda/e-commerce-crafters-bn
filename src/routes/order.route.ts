import express from "express";
import { updateOrderStatus } from "../controllers/orderController";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { getOrderStatus, updateOrderStatus } from "../controllers/orderStatus.controller";
import { verifyAdmin } from "../middleware/verifyRole";
const router = express.Router();

router.put("/order/:orderId/order-status", VerifyAccessToken, updateOrderStatus);

router.get('/order/:orderId/status',VerifyAccessToken, getOrderStatus);
router.put('/order/:orderId/status',VerifyAccessToken, verifyAdmin, updateOrderStatus);

export default router;
