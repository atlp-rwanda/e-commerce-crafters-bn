"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyOrderStatus = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
const modifyOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.token.userId;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid order status" });
        }
        const order = yield order_1.default.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.userId !== userId) {
            return res
                .status(403)
                .json({ error: "Only the vendor can update the order status" });
        }
        order.status = status;
        yield order.save();
        res
            .status(200)
            .json({ message: `Order has been ${status.toLowerCase()}`, order });
    }
    catch (error) {
        console.error(`Failed to update order status: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
exports.modifyOrderStatus = modifyOrderStatus;
