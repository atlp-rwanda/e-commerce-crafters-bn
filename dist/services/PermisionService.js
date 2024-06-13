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
exports.checkVendorPermission = exports.checkVendorModifyPermission = void 0;
const product_1 = __importDefault(require("../database/models/product"));
const vendor_1 = __importDefault(require("../database/models/vendor"));
const checkVendorModifyPermission = (tokenData, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokenData.role !== "vendor") {
        return {
            allowed: false,
            message: "You are not allowed to perfom this action",
            status: 403,
        };
    }
    const vendorExist = yield vendor_1.default.findByPk(vendorId);
    if (!vendorExist) {
        return {
            allowed: false,
            message: "You are not allowed to perfom this action ",
            status: 403,
        };
    }
    const vendorProduct = yield product_1.default.findOne({ where: { vendorId } });
    if (!vendorProduct) {
        return {
            allowed: false,
            message: "You are not allowed to perfom this action ",
            status: 403,
        };
    }
    return { allowed: true };
});
exports.checkVendorModifyPermission = checkVendorModifyPermission;
const checkVendorPermission = (tokenData, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (tokenData.role !== "vendor") {
        return {
            allowed: false,
            message: "You are not allowed to perfom this action",
            status: 403,
        };
    }
    const checkVendor = yield vendor_1.default.findByPk(vendorId);
    if (!checkVendor) {
        return {
            allowed: false,
            message: "You are not allowed to perfom this action",
            status: 403,
        };
    }
    return { allowed: true };
});
exports.checkVendorPermission = checkVendorPermission;
