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
exports.createOrder = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const cart_1 = __importDefault(require("../database/models/cart"));
const cartitem_1 = __importDefault(require("../database/models/cartitem"));
const uuid_1 = require("uuid");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, deliveryAddress, paymentMethod } = req.body;
    if (!userId || !deliveryAddress || !paymentMethod) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const cart = yield cart_1.default.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItems = yield cartitem_1.default.findAll({ where: { cartId: cart.cartId } });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }
        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const order = yield order_1.default.create({
            orderId: (0, uuid_1.v4)(),
            deliveryAddress,
            userId,
            paymentMethod,
            status: 'pending',
            products: orderItems,
            totalAmount: totalAmount
        });
        yield cartitem_1.default.destroy({ where: { cartId: cart.cartId } });
        res.status(201).json({ message: 'Order placed successfully', order });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createOrder = createOrder;
