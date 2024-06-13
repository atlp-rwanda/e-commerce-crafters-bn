"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _2fa_middleware_1 = require("./../middleware/2fa.middleware");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const review_controller_1 = require("../controllers/review.controller");
const route = express_1.default.Router();
route.get("/", user_controller_1.Welcome);
route.post("/register", user_controller_1.register);
route.patch("/updateuser/:id", user_controller_1.editUser);
route.patch("/updatepassword/:id", user_controller_1.updatePassword);
route.delete("/deleteuser/:id", user_controller_1.deleteUser);
route.post("/login", _2fa_middleware_1.twoFAController, user_controller_1.login);
route.post("/addreview/:id", review_controller_1.addReview);
route.post("/addfeedback/:id", review_controller_1.addFeedback);
exports.default = route;
