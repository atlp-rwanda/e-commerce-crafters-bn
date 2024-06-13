"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const verfiyToken_1 = require("../middleware/verfiyToken");
const router = express_1.default.Router();
router.post("/create/product/:id", verfiyToken_1.VerifyAccessToken, product_controller_1.createProduct);
router.get("/readAllProducts", product_controller_1.readAllProducts);
router.get("/vendorProducts/:id", verfiyToken_1.VerifyAccessToken, product_controller_1.viewProducts);
router.get("/readProduct/:id", product_controller_1.readProduct);
router.get("/products/search", product_controller_1.searchProduct);
router.get("/products/vendor/:id", verfiyToken_1.VerifyAccessToken, product_controller_1.viewProducts);
router.put("/updateProduct/:id", verfiyToken_1.VerifyAccessToken, product_controller_1.updateProduct);
router.delete("/deleteProduct/:id", verfiyToken_1.VerifyAccessToken, product_controller_1.deleteProduct);
exports.default = router;
