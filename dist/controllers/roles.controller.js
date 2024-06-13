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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVendor = exports.approveVendor = void 0;
const rolesService_1 = require("../services/rolesService");
// Approve Vendor's Request and Change Role
const approveVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield (0, rolesService_1.approveVendorRequest)(userId);
        res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.approveVendor = approveVendor;
// Reject Vendor's Request
const rejectVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield (0, rolesService_1.rejectVendorRequest)(userId);
        res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.rejectVendor = rejectVendor;
