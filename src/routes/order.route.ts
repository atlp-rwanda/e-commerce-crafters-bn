import express from "express";
import {
  orderShippedStatus,
  orderDeliveredStatus,
  orderPendingStatus,
  orderCancelledStatus,
} from "../controllers/orderController";
import { getOrderStatus, updateOrderStatus } from "../controllers/orderstatus.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { verifyAdmin } from "../middleware/verifyRole";

const router = express.Router();

router.put("/order/:orderId/ship", VerifyAccessToken, orderShippedStatus);
router.put("/order/:orderId/pending", VerifyAccessToken, orderPendingStatus);
router.put(
  "/order/:orderId/delivered",
  VerifyAccessToken,
  orderDeliveredStatus
);
router.put(
  "/order/:orderId/cancelled",
  VerifyAccessToken,
  orderCancelledStatus
);

router.get('/order/:orderId/status',VerifyAccessToken, getOrderStatus);
router.put('/order/:orderId/status',VerifyAccessToken, verifyAdmin, updateOrderStatus);

export default router;
