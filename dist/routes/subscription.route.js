"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const router = (0, express_1.Router)();
router.post("/save-subscription", subscription_controller_1.saveSubscription);
router.delete("/unsubscribe", subscription_controller_1.deleteSubscription);
exports.default = router;
