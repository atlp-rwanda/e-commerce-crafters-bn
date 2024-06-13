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
const vendor_controller_1 = require("../controllers/vendor.controller");
const vendor_1 = __importDefault(require("../database/models/vendor"));
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const index_1 = require("../index");
const user_1 = __importDefault(require("../database/models/user"));
jest.setTimeout(50000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => index_1.server.close(resolve));
}));
describe("Vendor Deletion", () => {
    let req;
    let res;
    let json;
    let status;
    let findByPkStub;
    beforeEach(() => {
        req = { params: { id: "1" } };
        json = sinon_1.default.spy();
        status = sinon_1.default.stub().returns({ json });
        res = { status };
        findByPkStub = sinon_1.default.stub(vendor_1.default, "findByPk");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return status 200 and success message if vendor is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        const destroyStub = sinon_1.default.stub().resolves(true);
        findByPkStub.resolves({
            destroy: destroyStub,
        });
        yield (0, vendor_controller_1.deletingVendor)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledOnce(destroyStub);
        sinon_1.default.assert.calledWith(status, 200);
        sinon_1.default.assert.calledWith(json, { message: "Vendor deleted successful" });
    }));
    it("should return status 500 and error message if an exception occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.rejects(new Error("Internal server error"));
        yield (0, vendor_controller_1.deletingVendor)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledWith(status, 500);
        sinon_1.default.assert.calledWith(json, { error: "Internal server error" });
    }));
    it("should return status 404 and error message if vendor is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.resolves(null);
        yield (0, vendor_controller_1.deletingVendor)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledWith(json, { error: "Vendor not found" });
    }));
});
describe('registerVendor', () => {
    let createStub;
    let findOneStub;
    beforeAll(() => {
        createStub = sinon_1.default.stub(vendor_1.default, 'create');
        findOneStub = sinon_1.default.stub(user_1.default, 'findOne');
    });
    afterAll((done) => {
        createStub.restore();
        findOneStub.restore();
        if (index_1.server.listening) {
            index_1.server.close(done);
        }
        else {
            done();
        }
    });
    it('should return 400 if userId, storeName, address, TIN, bankAccount, and paymentDetails are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/requestVendor')
            .send({ userIds: "user123", storeNames: "storeName", address: "address", TINs: 784378, bankAccounts: 853509345, paymentDetail: "momo pay" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Please fill all fields');
    }));
    it('should return 200 and vendor saved successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const newVendor = {
            userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129",
            storeName: "storeName",
            address: "address",
            TIN: 784378,
            bankAccount: 853509345,
            paymentDetails: "momo pay"
        };
        findOneStub.resolves({ id: '5d7f1cce-8dc4-4e9c-b426-11fbda9f4129' });
        createStub.resolves(newVendor);
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/requestVendor')
            .send({ userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Vendor requested successfully');
        expect(res.body.vendor).toEqual(newVendor);
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        findOneStub.resolves({ id: '5d7f1cce-8dc4-4e9c-b426-11fbda9f4129' });
        createStub.rejects(new Error('Internal server error'));
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/requestVendor')
            .send({ userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Internal server error');
    }));
    it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        findOneStub.resolves(null);
        const res = yield (0, supertest_1.default)(index_1.app)
            .post('/requestVendor')
            .send({ userId: "nonexistentUser", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    }));
});
describe('PATCH /updateVendor/', () => {
    let findOneVendorStub;
    let updateVendorStub;
    beforeEach(() => {
        findOneVendorStub = sinon_1.default.stub(vendor_1.default, 'findOne');
        updateVendorStub = sinon_1.default.stub(vendor_1.default.prototype, 'save');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should return 404 if vendor not found', () => __awaiter(void 0, void 0, void 0, function* () {
        findOneVendorStub.resolves(null);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch('/updateVendor/1')
            .send({ name: 'New Vendor Name' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Vendor not found');
    }));
    it('should update vendor successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockVendor = { vendorId: '1', name: 'Existing Vendor Name', save: jest.fn().mockResolvedValue({ vendorId: '1', name: 'New Vendor Name' }) };
        findOneVendorStub.resolves(mockVendor);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch('/updateVendor/1')
            .send({ name: 'New Vendor Name' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Vendor update success');
        expect(response.body).toHaveProperty('vendor');
        expect(response.body.vendor).toEqual({ vendorId: '1', name: 'New Vendor Name' });
    }));
    it('should return 500 if there is a database error', () => __awaiter(void 0, void 0, void 0, function* () {
        findOneVendorStub.rejects(new Error('Database error'));
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch('/updateVendor/1')
            .send({ name: 'New Vendor Name' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal server error');
    }));
});
