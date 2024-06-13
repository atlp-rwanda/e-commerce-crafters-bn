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
exports.updateCart = exports.deleteProductFromCart = exports.clearCart = exports.getCart = exports.addToCart = void 0;
const cart_1 = __importDefault(require("../database/models/cart"));
const cartitem_1 = __importDefault(require("../database/models/cartitem"));
const user_1 = __importDefault(require("../database/models/user"));
const product_1 = __importDefault(require("../database/models/product"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity, price } = req.body;
        let cart = yield cart_1.default.findOne({ where: { userId } });
        if (!cart) {
            cart = yield cart_1.default.create({
                userId,
            });
            yield user_1.default.update({ cartId: cart.cartId }, { where: { userId } });
            const cartItem = yield cartitem_1.default.create({
                cartId: cart.cartId,
                productId,
                quantity,
                price,
            });
            if (cartItem) {
                return res
                    .status(200)
                    .json({ message: "cart added successfully!", cart: cartItem });
            }
        }
        else {
            const existedProduct = yield cartitem_1.default.findOne({
                where: {
                    cartId: cart.cartId,
                    productId,
                },
            });
            if (existedProduct) {
                return res.status(409).json({ message: "product is already exists" });
            }
            const cartItem = yield cartitem_1.default.create({
                cartId: cart.cartId,
                productId,
                quantity,
                price,
            });
            if (cartItem) {
                return res
                    .status(200)
                    .json({ message: "cart added successfully!", cart: cartItem });
            }
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cart = yield cart_1.default.findOne({
            where: { userId },
            include: [{ model: cartitem_1.default, as: "cartItems" }],
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartitem = yield cartitem_1.default.findAll({ where: { cartId: cart.cartId } });
        return res.status(200).json({ cartitem });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCart = getCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cart = yield cart_1.default.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        yield cartitem_1.default.destroy({ where: { cartId: cart.cartId } });
        return res.status(200).json({ message: "Cart cleared successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.clearCart = clearCart;
const deleteProductFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        const cart = yield cart_1.default.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartItem = yield cartitem_1.default.findOne({
            where: {
                cartId: cart.cartId,
                productId,
            },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        yield cartItem.destroy();
        return res
            .status(200)
            .json({ message: "Product removed from cart successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteProductFromCart = deleteProductFromCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body.updates;
        for (const update of updates) {
            const { productId, quantity } = update;
            const product = yield product_1.default.findOne({ where: { productId } });
            if (!product) {
                return res
                    .status(404)
                    .json({ message: `Product ${productId} Not Found` });
            }
            if (quantity <= 0 ||
                !Number.isInteger(quantity) ||
                product.quantity < quantity) {
                return res.status(400).json({
                    message: `Only ${product.quantity} ${product.name} available In store`,
                });
            }
        }
        for (const update of updates) {
            const { cartId, productId, quantity, price } = update;
            const cartItem = yield cartitem_1.default.findOne({
                where: { cartId, productId },
            });
            if (!cartItem) {
                return res
                    .status(404)
                    .json({ message: `Cart Items for Product ${productId} Not Found` });
            }
            yield cartitem_1.default.update({ quantity, price }, { where: { cartId, productId } });
        }
        const cartItems = yield cartitem_1.default.findAll({
            where: { cartId: updates[0].cartId },
        });
        const cartTotal = yield cartitem_1.default.sum("price", {
            where: { cartId: updates[0].cartId },
        });
        return res.status(200).json({
            message: "Cart items updated successfully!",
            cartItems: cartItems,
            total: cartTotal,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateCart = updateCart;
