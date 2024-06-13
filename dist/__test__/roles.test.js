"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const index_1 = require("../index");
const rolesService = __importStar(require("../services/rolesService"));
const user_1 = __importDefault(require("../database/models/user"));
const vendor_1 = __importDefault(require("../database/models/vendor"));
const nodemailer_1 = __importDefault(require("nodemailer"));
beforeAll(() => { });
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => index_1.server.close(resolve));
}));
describe("Vendor Approval Endpoint", () => {
    let approveVendorRequestStub;
    let vendorFindOneStub;
    let userFindOneStub;
    let vendorUpdateStub;
    let userUpdateStub;
    let transporter;
    beforeEach(() => {
        approveVendorRequestStub = sinon_1.default.stub(rolesService, "approveVendorRequest");
        vendorFindOneStub = sinon_1.default.stub(vendor_1.default, "findOne");
        userFindOneStub = sinon_1.default.stub(user_1.default, "findOne");
        vendorUpdateStub = sinon_1.default.stub(vendor_1.default, "update");
        userUpdateStub = sinon_1.default.stub(user_1.default, "update");
        transporter = {
            sendMail: sinon_1.default.stub().resolves(),
        };
        sinon_1.default.stub(nodemailer_1.default, "createTransport").returns(transporter);
    });
    afterEach(() => {
        approveVendorRequestStub.restore();
        vendorFindOneStub.restore();
        userFindOneStub.restore();
        vendorUpdateStub.restore();
        userUpdateStub.restore();
        nodemailer_1.default.createTransport.restore();
        sinon_1.default.restore();
    });
    it("should approve vendor request successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        vendorFindOneStub.resolves({ userId: "123" });
        userFindOneStub.resolves({
            userId: "123",
            email: "test@example.com",
            name: "Test User",
        });
        vendorUpdateStub.resolves([1]);
        userUpdateStub.resolves([1]);
        approveVendorRequestStub.resolves({
            status: 200,
            message: "Vendor Request Approved",
        });
        const response = yield (0, supertest_1.default)(index_1.app).put("/approve-vendor/123");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Vendor Request Approved");
    }));
    it("should return 404 if vendor request is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        vendorFindOneStub.resolves(null);
        approveVendorRequestStub.resolves({
            status: 404,
            message: "Vendor Request Not Found",
        });
        const response = yield (0, supertest_1.default)(index_1.app).put("/approve-vendor/123");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Vendor Request Not Found");
    }));
    it("should return 500 if there is an internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
        vendorFindOneStub.rejects(new Error("Internal server error"));
        approveVendorRequestStub.rejects(new Error("Internal server error"));
        const response = yield (0, supertest_1.default)(index_1.app).put("/approve-vendor/123");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    }));
});
