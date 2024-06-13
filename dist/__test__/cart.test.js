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
const index_1 = require("../index");
const sinon_1 = __importDefault(require("sinon"));
const cart_1 = __importDefault(require("../database/models/cart"));
const cartitem_1 = __importDefault(require("../database/models/cartitem"));
const user_1 = __importDefault(require("../database/models/user"));
const product_1 = __importDefault(require("../database/models/product"));
jest.setTimeout(500);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => index_1.server.close(resolve));
}));
describe("Cart Controller - addToCart", () => {
    let findOneCartStub, createCartStub, updateCartStub, createCartItemStub;
    beforeEach(() => {
        findOneCartStub = sinon_1.default.stub(cart_1.default, "findOne");
        createCartStub = sinon_1.default.stub(cart_1.default, "create");
        updateCartStub = sinon_1.default.stub(user_1.default, "update");
        createCartItemStub = sinon_1.default.stub(cartitem_1.default, "create");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should add a product to the cart", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "user1";
        const productId = "product1";
        const quantity = 2;
        const price = 10;
        findOneCartStub.resolves(null);
        createCartStub.resolves({ cartId: "cart1", userId });
        updateCartStub.resolves([1]);
        createCartItemStub.resolves({ cartId: "cart1", productId, quantity, price });
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/addcart")
            .send({ userId, productId, quantity, price });
        console.log("Response:", response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "cart added successfully!");
        expect(response.body).toHaveProperty("cart");
    }), 10000);
});
describe("Cart Controller - getCart", () => {
    let findOneCartStub, findAllCartItemStub;
    beforeEach(() => {
        findOneCartStub = sinon_1.default.stub(cart_1.default, "findOne");
        findAllCartItemStub = sinon_1.default.stub(cartitem_1.default, "findAll");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should retrieve the cart for a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "user1";
        findOneCartStub.resolves({ cartId: "cart1", userId });
        findAllCartItemStub.resolves([
            { cartId: "cart1", productId: "product1", quantity: 2, price: 10 },
        ]);
        const response = yield (0, supertest_1.default)(index_1.app).get(`/getcart/${userId}`);
        console.log("getCart Response:", response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("cartitem");
    }), 10000);
});
describe("Cart Controller - clearCart", () => {
    let findOneCartStub, destroyCartItemStub;
    beforeEach(() => {
        findOneCartStub = sinon_1.default.stub(cart_1.default, "findOne");
        destroyCartItemStub = sinon_1.default.stub(cartitem_1.default, "destroy");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should clear the cart for a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "user1";
        findOneCartStub.resolves({ cartId: "cart1", userId });
        destroyCartItemStub.resolves(1);
        const response = yield (0, supertest_1.default)(index_1.app).delete(`/clearcart/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Cart cleared successfully");
    }));
});
describe("Cart Controller - updateCart", () => {
    let findOneProductStub, findOneCartItemStub, updateCartItemStub, findAllCartItemStub, sumCartItemStub;
    beforeEach(() => {
        findOneProductStub = sinon_1.default.stub(product_1.default, "findOne");
        findOneCartItemStub = sinon_1.default.stub(cartitem_1.default, "findOne");
        updateCartItemStub = sinon_1.default.stub(cartitem_1.default, "update");
        findAllCartItemStub = sinon_1.default.stub(cartitem_1.default, "findAll");
        sumCartItemStub = sinon_1.default.stub(cartitem_1.default, "sum");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should update the quantities of products in the cart", () => __awaiter(void 0, void 0, void 0, function* () {
        const updates = [
            { cartId: "cart1", productId: "product1", quantity: 3, price: 15 },
            { cartId: "cart1", productId: "product2", quantity: 2, price: 20 },
        ];
        findOneProductStub
            .withArgs({ where: { productId: "product1" } })
            .resolves({ productId: "product1", quantity: 10, name: "Product 1" });
        findOneProductStub
            .withArgs({ where: { productId: "product2" } })
            .resolves({ productId: "product2", quantity: 10, name: "Product 2" });
        findOneCartItemStub
            .withArgs({ where: { cartId: "cart1", productId: "product1" } })
            .resolves({ cartId: "cart1", productId: "product1" });
        findOneCartItemStub
            .withArgs({ where: { cartId: "cart1", productId: "product2" } })
            .resolves({ cartId: "cart1", productId: "product2" });
        updateCartItemStub.resolves([1]);
        findAllCartItemStub.resolves(updates);
        sumCartItemStub.resolves(45);
        const response = yield (0, supertest_1.default)(index_1.app).post("/updatecart").send({ updates });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Cart items updated successfully!");
        expect(response.body).toHaveProperty("cartItems");
        expect(response.body).toHaveProperty("total");
    }));
});
