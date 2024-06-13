"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const vendor_controller_1 = require("../controllers/vendor.controller");
const product_controller_1 = require("../controllers/product.controller");
const review_controller_1 = require("../controllers/review.controller");
route.post('/requestVendor', vendor_controller_1.registerVendor);
route.delete('/deleteVendor/:id', vendor_controller_1.deletingVendor);
route.get('/vendorProduct/:id', product_controller_1.viewProducts);
route.patch('/updateVendor/:id', vendor_controller_1.editVendor);
route.get('/select-review/:id', review_controller_1.selectReview);
route.get('/select-feedback/:id', review_controller_1.selectFeedback);
exports.default = route;
