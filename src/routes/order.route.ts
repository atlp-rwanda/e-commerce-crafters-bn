import express from "express";
import { getAllOrder, modifyOrderStatus, getOrder } from "../controllers/orderController";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import {
  getOrderStatus,
  updateOrderStatus,
} from "../controllers/orderStatus.controller";
import { verifyAdmin } from "../middleware/verifyRole";
const router = express.Router();

router.put(
  "/order/:orderId/order-status",
  
  updateOrderStatus
);

router.get("/order/:orderId/status", getOrderStatus);

router.put(
  "/order/:orderId/product/:productId/status",
 
  modifyOrderStatus
);

router.get("/order/getAllOrder", getAllOrder);
router.get("/order/getOrder/:orderId", getOrder);

export default router;
