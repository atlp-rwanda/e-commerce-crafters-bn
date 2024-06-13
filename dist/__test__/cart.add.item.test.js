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
const index_1 = require("../index");
const cart_1 = __importDefault(require("../database/models/cart"));
const cartitem_1 = __importDefault(require("../database/models/cartitem"));
beforeAll(() => {
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => index_1.server.close(resolve));
}));
describe("Cart API", () => {
    let findOneCartStub;
    let createCartStub;
    let createCartItemStub;
    let findOneCartItemStub;
    beforeAll(() => {
        findOneCartStub = sinon_1.default.stub(cart_1.default, "findOne");
        createCartStub = sinon_1.default.stub(cart_1.default, "create");
        createCartItemStub = sinon_1.default.stub(cartitem_1.default, "create");
        findOneCartItemStub = sinon_1.default.stub(cartitem_1.default, "findOne");
    });
    afterAll((done) => {
        findOneCartStub.restore();
        createCartStub.restore();
        createCartItemStub.restore();
        findOneCartItemStub.restore();
        done();
    });
    it("should add an item to the cart successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = { cartId: "cart1", userId: "user1" };
        const cartItem = {
            cartId: "cart1",
            productId: "prod1",
            quantity: 3,
            price: 45,
        };
        findOneCartStub.resolves(cart);
        createCartItemStub.resolves(cartItem);
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/addcart")
            .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("cart added successfully!");
        expect(res.body.cart).toEqual(cartItem);
    }));
    it("should return 409 if the product is already in the cart", () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = { cartId: "cart1", userId: "user1" };
        const existingCartItem = { cartId: "cart1", productId: "prod1" };
        findOneCartStub.resolves(cart);
        findOneCartItemStub.resolves(existingCartItem);
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/addcart")
            .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("product is already exists");
    }));
    it("should handle errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneCartStub.rejects(new Error("Internal server error"));
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/addcart")
            .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error");
    }));
});
