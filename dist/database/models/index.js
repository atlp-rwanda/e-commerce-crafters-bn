"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("./admin"));
const cart_1 = __importDefault(require("./cart"));
const cartitem_1 = __importDefault(require("./cartitem"));
const messages_1 = __importDefault(require("./messages"));
const order_1 = __importDefault(require("./order"));
const product_1 = __importDefault(require("./product"));
const rating_1 = __importDefault(require("./rating"));
const review_1 = __importDefault(require("./review"));
const subscription_1 = __importDefault(require("./subscription"));
const user_1 = __importDefault(require("./user"));
const vendor_1 = __importDefault(require("./vendor"));
const wishlist_1 = __importDefault(require("./wishlist"));
const wishlistItem_1 = __importDefault(require("./wishlistItem"));
const models = {
    User: user_1.default,
    Cart: cart_1.default,
    Vendor: vendor_1.default,
    Product: product_1.default,
    Wishlist: wishlist_1.default,
    CartItem: cartitem_1.default,
    Order: order_1.default,
    Admin: admin_1.default,
    Message: messages_1.default,
    Subscription: subscription_1.default,
    Rating: rating_1.default,
    Review: review_1.default,
    WishlistItem: wishlistItem_1.default,
};
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
exports.default = models;
