import express from 'express';
import { getOrderStatus, updateOrderStatus } from '../controllers/orderstatus.controller';
import { VerifyAccessToken } from '../middleware/verfiyToken';
import { verifyAdmin } from '../middleware/verifyRole';
const router  = express.Router();

router.get('/order/:orderId/status',VerifyAccessToken, getOrderStatus);
router.put('/order/:orderId/status',VerifyAccessToken, verifyAdmin, updateOrderStatus);

export default router;