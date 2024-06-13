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
const index_1 = require("../index");
const sinon_1 = __importDefault(require("sinon"));
const user_1 = __importDefault(require("../database/models/user"));
const subscriptionService = __importStar(require("../services/subscription.service"));
const subscription_1 = __importDefault(require("../database/models/subscription"));
jest.setTimeout(50000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => index_1.server.close(resolve));
}));
describe('Subscription Tests', () => {
    let findUserStub;
    let findSubscriptionStub;
    let createSubscriptionStub;
    let registerSubscriptionStub;
    let unsubscribeStub;
    beforeEach(() => {
        findUserStub = sinon_1.default.stub(user_1.default, 'findOne');
        findSubscriptionStub = sinon_1.default.stub(subscription_1.default, 'findOne');
        createSubscriptionStub = sinon_1.default.stub(subscription_1.default, 'create');
        registerSubscriptionStub = sinon_1.default.stub(subscriptionService, 'registerSubscription');
        unsubscribeStub = sinon_1.default.stub(subscriptionService, 'unsubscribe');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    describe('POST /save-subscription', () => {
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            findUserStub.resolves(null);
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({ email: 'test@example.com' });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        }));
        it('should return 403 if email already exists in subscriptions', () => __awaiter(void 0, void 0, void 0, function* () {
            findUserStub.resolves({ id: 1, email: 'test@example.com' });
            findSubscriptionStub.resolves({ id: 1, email: 'test@example.com' });
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({ email: 'test@example.com' });
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Email already exists');
        }));
        it('should return 400 if email is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email is required');
        }));
        it('should return 500 if saving subscription fails', () => __awaiter(void 0, void 0, void 0, function* () {
            findUserStub.resolves({ id: 1, email: 'test@example.com' });
            findSubscriptionStub.resolves(null);
            registerSubscriptionStub.resolves(false);
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({ email: 'test@example.com' });
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Failed to save subscription');
        }));
        it('should return 201 if subscription is created successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            findUserStub.resolves({ id: 1, email: 'test@example.com' });
            findSubscriptionStub.resolves(null);
            registerSubscriptionStub.resolves({ id: 1, email: 'test@example.com' });
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({ email: 'test@example.com' });
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Subscription Created');
            expect(res.body.data).toEqual({ id: 1, email: 'test@example.com' });
        }));
        it('should return 500 for an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
            findUserStub.rejects(new Error('Internal server error'));
            const res = yield (0, supertest_1.default)(index_1.app).post('/save-subscription').send({ email: 'test@example.com' });
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal server error');
        }));
    });
    describe('DELETE /unsubscribe', () => {
        it('should return 200 if subscription is deleted successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            unsubscribeStub.resolves();
            const res = yield (0, supertest_1.default)(index_1.app).delete('/unsubscribe').send({ email: 'test@example.com' });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Subscription deleted successfully');
        }));
        it('should return 400 if email is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).delete('/unsubscribe').send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Email is required');
        }));
        it('should return 500 if there is an error deleting the subscription', () => __awaiter(void 0, void 0, void 0, function* () {
            unsubscribeStub.rejects(new Error('Subscription not found'));
            const res = yield (0, supertest_1.default)(index_1.app).delete('/unsubscribe').send({ email: 'test@example.com' });
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Subscription not found');
        }));
    });
});
