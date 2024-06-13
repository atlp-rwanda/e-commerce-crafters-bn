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
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const events_1 = require("../helpers/events");
const __1 = require("..");
const product_1 = __importDefault(require("../database/models/product"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken() {
    const payload = { userId: 'test-user' };
    const secret = process.env.JWT_SECRET || 'crafters1234';
    const options = { expiresIn: '1h' };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
jest.setTimeout(50000);
beforeAll(() => {
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => __1.server.close(resolve));
}));
describe('createProduct', () => {
    let checkVendorPermissionStub;
    let saveProductStub;
    let productLifecycleEmitterStub;
    beforeEach(() => {
        checkVendorPermissionStub = sinon_1.default.stub(require('../services/PermisionService'), 'checkVendorPermission');
        saveProductStub = sinon_1.default.stub(require('../services/productService'), 'saveProduct');
        productLifecycleEmitterStub = sinon_1.default.stub(events_1.productLifecycleEmitter, 'emit');
    });
    afterEach(() => {
        checkVendorPermissionStub.restore();
        saveProductStub.restore();
        productLifecycleEmitterStub.restore();
    });
    it('should return 500 if saving product fails', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorPermissionStub.resolves({ allowed: true });
        saveProductStub.resolves(null);
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .post('/create/product/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Failed to save data');
    }));
    it('should return 201 if product is created successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorPermissionStub.resolves({ allowed: true });
        saveProductStub.resolves({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .post('/create/product/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Product Created');
        expect(res.body.data).toEqual({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorPermissionStub.rejects(new Error('Internal server error'));
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .post('/create/product/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal server error');
    }));
});
describe('updateProduct', () => {
    let checkVendorModifyPermissionStub;
    let productFindByPkStub;
    let productUpdateStub;
    let productLifecycleEmitterStub;
    beforeEach(() => {
        checkVendorModifyPermissionStub = sinon_1.default.stub(require('../services/PermisionService'), 'checkVendorModifyPermission');
        productFindByPkStub = sinon_1.default.stub(product_1.default, 'findByPk');
        productUpdateStub = sinon_1.default.stub(product_1.default, 'update');
        productLifecycleEmitterStub = sinon_1.default.stub(events_1.productLifecycleEmitter, 'emit');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should return 404 if product is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.resolves({ allowed: true });
        productFindByPkStub.resolves(null);
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .put('/updateProduct/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
            vendorId: 'vendor1',
            name: 'Updated Product',
            image: 'updated_image.png',
            description: 'Updated description',
            price: 200,
            quantity: 20,
            category: 'Electronics'
        });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Product not found');
    }));
    it('should return 403 if vendor does not have permission to modify the product', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'Permission denied' });
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .put('/updateProduct/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
            vendorId: 'vendor1',
            name: 'Updated Product',
            image: 'updated_image.png',
            description: 'Updated description',
            price: 200,
            quantity: 20,
            category: 'Electronics'
        });
        expect(res.status).toBe(403);
        expect(res.body.message).toBe('Permission denied');
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .put('/updateProduct/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
            vendorId: 'vendor1',
            name: 'Updated Product',
            image: 'updated_image.png',
            description: 'Updated description',
            price: 200,
            quantity: 20,
            category: 'Electronics'
        });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal server error');
    }));
    it('should update the product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedProduct = {
            id: '123',
            name: 'Updated Product',
            image: 'updated_image.png',
            description: 'Updated description',
            price: 200,
            quantity: 20,
            category: 'Electronics'
        };
        checkVendorModifyPermissionStub.resolves({ allowed: true });
        productFindByPkStub.resolves({ update: sinon_1.default.stub().resolves(updatedProduct) });
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .put('/updateProduct/123')
            .set('Authorization', `Bearer ${token}`)
            .send({
            vendorId: 'vendor1',
            name: 'Updated Product',
            image: 'updated_image.png',
            description: 'Updated description',
            price: 200,
            quantity: 20,
            category: 'Electronics'
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product updated successfully');
    }));
});
describe('deleteProduct', () => {
    let checkVendorModifyPermissionStub;
    let findByPkStub;
    let destroyStub;
    let productLifecycleEmitterStub;
    beforeEach(() => {
        checkVendorModifyPermissionStub = sinon_1.default.stub(require('../services/PermisionService'), 'checkVendorModifyPermission');
        findByPkStub = sinon_1.default.stub(product_1.default, 'findByPk');
        destroyStub = sinon_1.default.stub(product_1.default.prototype, 'destroy');
        productLifecycleEmitterStub = sinon_1.default.stub(events_1.productLifecycleEmitter, 'emit');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should return 404 if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.resolves({ allowed: true });
        findByPkStub.resolves(null);
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .delete('/deleteProduct/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ vendorId: '123' });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Product not found');
    }));
    it('should return 403 if permission denied', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'You are not allowed to perform this action' });
        findByPkStub.resolves({});
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .delete('/deleteProduct/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ vendorId: '123' });
        expect(res.status).toBe(403);
        expect(res.body.message).toBe('You are not allowed to perform this action');
    }));
    it('should delete product and return 200 if successful', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.resolves({ allowed: true });
        const product = { destroy: destroyStub };
        findByPkStub.resolves(product);
        destroyStub.resolves();
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .delete('/deleteProduct/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ vendorId: '123' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted successfully');
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));
        const token = generateToken();
        const res = yield (0, supertest_1.default)(__1.app)
            .delete('/deleteProduct/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ vendorId: '123' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal server error');
    }));
});
