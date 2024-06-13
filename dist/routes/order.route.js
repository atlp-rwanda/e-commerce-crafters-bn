"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verfiyToken_1 = require("../middleware/verfiyToken");
const orderStatus_controller_1 = require("../controllers/orderStatus.controller");
const verifyRole_1 = require("../middleware/verifyRole");
const router = express_1.default.Router();
router.put("/order/:orderId/order-status", verfiyToken_1.VerifyAccessToken, orderStatus_controller_1.updateOrderStatus);
router.get('/order/:orderId/status', verfiyToken_1.VerifyAccessToken, orderStatus_controller_1.getOrderStatus);
router.put('/order/:orderId/status', verfiyToken_1.VerifyAccessToken, verifyRole_1.verifyAdmin, orderStatus_controller_1.updateOrderStatus);
exports.default = router;
