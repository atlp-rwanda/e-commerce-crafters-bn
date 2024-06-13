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
exports.editVendor = exports.deletingVendor = exports.registerVendor = void 0;
const vendor_1 = __importDefault(require("../database/models/vendor"));
const vendorServices_1 = require("../services/vendorServices");
const user_1 = __importDefault(require("../database/models/user"));
const registerVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, storeName, address, TIN, bankAccount, paymentDetails } = req.body;
    if (!userId || !storeName || !address || !TIN || !bankAccount || !paymentDetails) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = yield user_1.default.findOne({ where: { userId: userId } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const insertVendor = yield vendor_1.default.create({
            userId: userId,
            storeName: storeName,
            address: address,
            TIN: TIN,
            bankAccount: bankAccount,
            paymentDetails
        });
        return res.status(200).json({ message: "Vendor requested successfully", vendor: insertVendor });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.registerVendor = registerVendor;
// Deleting vendor 
const deletingVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    try {
        yield (0, vendorServices_1.deleteVendorById)(vendorId);
        res.status(200).json({ message: "Vendor deleted successful" });
    }
    catch (error) {
        if (error.message === "Vendor not found") {
            res.status(404).json({ error: "Vendor not found" });
        }
        else {
            console.log("The error is: " + error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.deletingVendor = deletingVendor;
const editVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = req.body;
    const vendorId = req.params.id;
    try {
        const vendor = yield vendor_1.default.findOne({ where: { vendorId } });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        Object.keys(updates).forEach(key => {
            vendor[key] = updates[key];
        });
        const updatedVendor = yield vendor.save();
        res.status(200).json({ message: 'Vendor update success', vendor: updatedVendor });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.editVendor = editVendor;
