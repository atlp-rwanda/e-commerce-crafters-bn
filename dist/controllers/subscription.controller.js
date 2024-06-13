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
exports.deleteSubscription = exports.saveSubscription = void 0;
const user_1 = __importDefault(require("../database/models/user"));
const subscription_1 = __importDefault(require("../database/models/subscription"));
const subscription_service_1 = require("../services/subscription.service");
const saveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const duplicate = yield subscription_1.default.findOne({ where: { email } });
        if (duplicate) {
            return res.status(403).json({ message: "Email already exists" });
        }
        const subscription = yield (0, subscription_service_1.registerSubscription)(email);
        if (!subscription) {
            return res.status(500).json({ error: "Failed to save subscription" });
        }
        return res.status(201).json({ message: "Subscription Created", data: subscription });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.saveSubscription = saveSubscription;
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        yield (0, subscription_service_1.unsubscribe)(email);
        res.status(200).json({ message: "Subscription deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSubscription = deleteSubscription;
