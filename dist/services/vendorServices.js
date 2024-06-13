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
exports.updateVendor = exports.deleteVendorById = exports.saveVendor = void 0;
const vendor_1 = __importDefault(require("../database/models/vendor"));
const saveVendor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, storeName, address, TIN, bankAccount, paymentDetails } = data;
    const insertVendor = yield vendor_1.default.create({
        userId: userId,
        storeName: storeName,
        address: address,
        TIN: TIN,
        bankAccount: bankAccount,
        paymentDetails,
    });
    return insertVendor;
});
exports.saveVendor = saveVendor;
const deleteVendorById = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_1.default.findByPk(vendorId);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    yield vendor.destroy();
});
exports.deleteVendorById = deleteVendorById;
const updateVendor = (vendor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield vendor.save();
        return vendor;
    }
    catch (error) {
        throw new Error("Error updating vendor");
    }
});
exports.updateVendor = updateVendor;
