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
exports.updateOrderStatus = exports.getOrderStatus = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const __1 = require("..");
const getOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield order_1.default.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).json({ orderId, status: order.status, expectedDeliveryDate: order.expectedDeliveryDate });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getOrderStatus = getOrderStatus;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const status = req.body.status;
        const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'on hold', 'cancelled'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const order = yield order_1.default.findOne({ where: { orderId: orderId } });
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        order.status = status;
        if (status === 'processing') {
            const currentDate = new Date();
            const expectedDeliveryDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
            order.expectedDeliveryDate = expectedDeliveryDate;
        }
        yield order.save();
        const formattedDate = order.expectedDeliveryDate ? order.expectedDeliveryDate.toLocaleDateString() : null;
        __1.ioServer.emit('orderStatusUpdated', { orderId, status: order.status, expectedDeliveryDate: formattedDate });
        res.status(200).json({ orderId, status: order.status, expectedDeliveryDate: formattedDate });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
