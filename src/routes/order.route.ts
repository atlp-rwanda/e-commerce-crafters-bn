import express from "express";
import { updateOrderStatus } from "../controllers/orderController";
import { VerifyAccessToken } from "../middleware/verfiyToken";
const router = express.Router();

router.put("/order/:orderId/status", VerifyAccessToken, updateOrderStatus);

export default router;
