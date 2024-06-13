"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const roles_controller_1 = require("../controllers/roles.controller");
route.put("/approve-vendor/:userId", roles_controller_1.approveVendor);
route.put("/reject-vendor/:userId", roles_controller_1.rejectVendor);
exports.default = route;
