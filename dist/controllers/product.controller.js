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
exports.viewProducts = exports.deleteProduct = exports.updateProduct = exports.searchProduct = exports.readAllProducts = exports.readProduct = exports.createProduct = void 0;
const productService_1 = require("../services/productService");
const product_1 = __importDefault(require("../database/models/product"));
const PermisionService_1 = require("../services/PermisionService");
const events_1 = require("../helpers/events");
const sequelize_1 = require("sequelize");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const vendorId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res.status(permissionCheck.status).json({ message: permissionCheck.message });
        }
        const { name, image, description, discount, price, quantity, category, expiringDate } = req.body;
        if (!name || !image || !description || !price || !quantity || !category) {
            return res.status(200).json("All Field are required");
        }
        const data = {
            name,
            image,
            description,
            discount: discount ? discount : 0,
            price,
            quantity,
            category,
            vendorId: vendorId,
            expiringDate
        };
        const save = yield (0, productService_1.saveProduct)(data);
        if (!save) {
            return res.status(500).json({ error: "Failed to save data" });
        }
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_ADDED, data);
        return res.status(201).json({ message: "Product Created", data: save });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createProduct = createProduct;
const readProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield product_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.readProduct = readProduct;
const readAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = yield (0, productService_1.getAllProducts)(page, limit);
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.readAllProducts = readAllProducts;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const criteria = {};
        if (name)
            criteria.name = { [sequelize_1.Op.iLike]: `%${name}%` };
        if (category)
            criteria.category = { [sequelize_1.Op.iLike]: `%${category}%` };
        const products = yield (0, productService_1.searchProducts)(criteria, page, limit);
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.searchProduct = searchProduct;
// update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const { vendorId } = req.body;
        const productId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorModifyPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res.status(permissionCheck.status).json({ message: permissionCheck.message });
        }
        const updateData = req.body;
        const product = yield product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield product.update(updateData);
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_UPDATED, product);
        res
            .status(200)
            .json({ message: "Product updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
// delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const productId = req.params.id;
        const { vendorId } = req.body;
        const permissionCheck = yield (0, PermisionService_1.checkVendorModifyPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res.status(permissionCheck.status).json({ message: permissionCheck.message });
        }
        const product = yield product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield product.destroy();
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_REMOVED, product);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
const viewProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const vendorId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res.status(permissionCheck.status).json({ message: permissionCheck.message });
        }
        const products = yield product_1.default.findAll({
            where: { vendorId: vendorId }
        });
        if (!products.length) {
            res.status(404).json({ message: "No products found" });
            return;
        }
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.viewProducts = viewProducts;
