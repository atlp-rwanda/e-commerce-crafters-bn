import express from "express";
import {
  orderShippedStatus,
  orderDeliveredStatus,
  orderPendingStatus,
  orderCancelledStatus,
} from "../controllers/orderController";

import { VerifyAccessToken } from "../middleware/verfiyToken";

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

export default router;
