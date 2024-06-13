"use strict";
// helpers/serverSetup.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const vendor_route_1 = __importDefault(require("../routes/vendor.route"));
const SwaggerConfig_1 = __importDefault(require("../config/SwaggerConfig"));
const product_route_1 = __importDefault(require("../routes/product.route"));
const roles_route_1 = __importDefault(require("../routes/roles.route"));
const forget_password_router_1 = __importDefault(require("../routes/forget.password.router"));
const auth_router_1 = __importDefault(require("../routes/auth.router"));
const roles_route_2 = __importDefault(require("../routes/roles.route"));
const checkout_router_1 = __importDefault(require("../routes/checkout.router"));
const googleAuth_route_1 = __importDefault(require("../routes/googleAuth.route"));
;
const cart_route_1 = __importDefault(require("../routes/cart.route"));
const order_route_1 = __importDefault(require("../routes/order.route"));
const wishlist_route_1 = __importDefault(require("../routes/wishlist.route"));
const subscription_route_1 = __importDefault(require("../routes/subscription.route"));
const notifications_route_1 = __importDefault(require("../routes/notifications.route"));
dotenv_1.default.config();
const setupServer = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, express_session_1.default)({
        secret: "crafters1234",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_1.default.static("public"));
    app.use(express_1.default.json());
    // Add routes
    app.use("/", user_route_1.default);
    app.use("/", auth_router_1.default);
    app.use("/", product_route_1.default);
    app.use("/", forget_password_router_1.default);
    app.use("/", product_route_1.default);
    app.use("/", vendor_route_1.default);
    app.use("/", roles_route_2.default);
    app.use("/", order_route_1.default);
    app.use("/", checkout_router_1.default);
    app.use("/", googleAuth_route_1.default);
    app.use("/", subscription_route_1.default);
    app.use("/", notifications_route_1.default);
    app.use("/api-docs", SwaggerConfig_1.default);
    app.use("/admin", roles_route_1.default);
    app.use("/", cart_route_1.default);
    app.use("/", wishlist_route_1.default);
    return app;
};
exports.default = setupServer;
