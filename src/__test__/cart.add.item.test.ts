import request from "supertest";
import sinon from "sinon";
import { app, server } from "../index";
import Cart from "../database/models/cart";
import CartItem from "../database/models/cartitem";
import User from "../database/models/user";

beforeAll(() => {

});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve)); 
});
describe("Cart API", () => {
  let findOneCartStub: sinon.SinonStub;
  let createCartStub: sinon.SinonStub;
  let createCartItemStub: sinon.SinonStub;
  let findOneCartItemStub: sinon.SinonStub;

  beforeAll(() => {
    findOneCartStub = sinon.stub(Cart, "findOne");
    createCartStub = sinon.stub(Cart, "create");
    createCartItemStub = sinon.stub(CartItem, "create");
    findOneCartItemStub = sinon.stub(CartItem, "findOne");
  });

  afterAll((done) => {
    findOneCartStub.restore();
    createCartStub.restore();
    createCartItemStub.restore();
    findOneCartItemStub.restore();
    done();
  });

  it("should add an item to the cart successfully", async () => {
    const cart = { cartId: "cart1", userId: "user1" };
    const cartItem = {
      cartId: "cart1",
      productId: "prod1",
      quantity: 3,
      price: 45,
    };

    findOneCartStub.resolves(cart);
    createCartItemStub.resolves(cartItem);

    const res = await request(app)
      .post("/addcart")
      .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("cart added successfully!");
    expect(res.body.cart).toEqual(cartItem);
  });

  it("should return 409 if the product is already in the cart", async () => {
    const cart = { cartId: "cart1", userId: "user1" };
    const existingCartItem = { cartId: "cart1", productId: "prod1" };

    findOneCartStub.resolves(cart);
    findOneCartItemStub.resolves(existingCartItem);

    const res = await request(app)
      .post("/addcart")
      .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("product is already exists");
  });

  it("should handle errors gracefully", async () => {
    findOneCartStub.rejects(new Error("Internal server error"));

    const res = await request(app)
      .post("/addcart")
      .send({ userId: "user1", productId: "prod1", quantity: 3, price: 45 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });
});
