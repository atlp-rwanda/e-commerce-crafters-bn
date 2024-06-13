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
exports.searchProducts = exports.getProductById = exports.getAllProducts = exports.saveProduct = void 0;
const product_1 = __importDefault(require("../database/models/product"));
const saveProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield product_1.default.create(data);
    if (response) {
        return response;
    }
    else {
        return false;
    }
});
exports.saveProduct = saveProduct;
const getAllProducts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offset = (page - 1) * limit;
        const products = yield product_1.default.findAll();
        return products;
    }
    catch (error) {
        throw new Error('Error while fetching all products');
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.findByPk(productId);
        return product;
    }
    catch (error) {
        throw new Error('Error while fetching product');
    }
});
exports.getProductById = getProductById;
const searchProducts = (criteria, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offset = (page - 1) * limit;
        const products = yield product_1.default.findAll({
            where: criteria,
            offset,
            limit
        });
        return products;
    }
    catch (error) {
        throw new Error('Error while searching products');
    }
});
exports.searchProducts = searchProducts;
