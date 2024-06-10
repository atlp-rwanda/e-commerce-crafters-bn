import request from 'supertest';
import { app, server } from '../index';
import sinon from 'sinon';
import Cart from '../database/models/cart';
import CartItem from '../database/models/cartitem';
import User from '../database/models/user';
import Product from '../database/models/product';

jest.setTimeout(50000);

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe('Cart Controller - addToCart', () => {
  let findOneCartStub:sinon.SinonStub, createCartStub:sinon.SinonStub, updateCartStub:sinon.SinonStub, createCartItemStub:sinon.SinonStub;

  beforeEach(() => {
    findOneCartStub = sinon.stub(Cart, 'findOne');
    createCartStub = sinon.stub(Cart, 'create');
    updateCartStub = sinon.stub(User, 'update');
    createCartItemStub = sinon.stub(CartItem, 'create');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should add a product to the cart', async () => {
    const userId = 'user1';
    const productId = 'product1';
    const quantity = 2;
    const price = 10;

    findOneCartStub.resolves(null);
    createCartStub.resolves({ cartId: 'cart1', userId });
    updateCartStub.resolves([1]);
    createCartItemStub.resolves({ cartId: 'cart1', productId, quantity, price });

    const response = await request(app)
      .post('/addcart')
      .send({ userId, productId, quantity, price });

    console.log('Response:', response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'cart added successfully!');
    expect(response.body).toHaveProperty('cart');
  });
});




describe('Cart Controller - getCart', () => {
  let findOneCartStub:sinon.SinonStub, findAllCartItemStub:sinon.SinonStub;

  beforeEach(() => {
    findOneCartStub = sinon.stub(Cart, 'findOne');
    findAllCartItemStub = sinon.stub(CartItem, 'findAll');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should retrieve the cart for a user', async () => {
    const userId = 'user1';

    findOneCartStub.resolves({ cartId: 'cart1', userId });
    findAllCartItemStub.resolves([{ cartId: 'cart1', productId: 'product1', quantity: 2, price: 10 }]);

    const response = await request(app).get(`/getcart/${userId}`);

    console.log('getCart Response:', response.body);  

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('cartitem');
  });
});





describe('Cart Controller - clearCart', () => {
  let findOneCartStub:sinon.SinonStub, destroyCartItemStub:sinon.SinonStub;

  beforeEach(() => {
    findOneCartStub = sinon.stub(Cart, 'findOne');
    destroyCartItemStub = sinon.stub(CartItem, 'destroy');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should clear the cart for a user', async () => {
    const userId = 'user1';

    findOneCartStub.resolves({ cartId: 'cart1', userId });
    destroyCartItemStub.resolves(1);

    const response = await request(app).delete(`/clearcart/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Cart cleared successfully');
  });
});



describe('Cart Controller - updateCart', () => {
  let findOneProductStub:sinon.SinonStub, findOneCartItemStub:sinon.SinonStub, updateCartItemStub:sinon.SinonStub, findAllCartItemStub:sinon.SinonStub, sumCartItemStub:sinon.SinonStub;

  beforeEach(() => {
    findOneProductStub = sinon.stub(Product, 'findOne');
    findOneCartItemStub = sinon.stub(CartItem, 'findOne');
    updateCartItemStub = sinon.stub(CartItem, 'update');
    findAllCartItemStub = sinon.stub(CartItem, 'findAll');
    sumCartItemStub = sinon.stub(CartItem, 'sum');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should update the quantities of products in the cart', async () => {
    const updates = [
      { cartId: 'cart1', productId: 'product1', quantity: 3, price: 15 },
      { cartId: 'cart1', productId: 'product2', quantity: 2, price: 20 },
    ];

    findOneProductStub.withArgs({ where: { productId: 'product1' } }).resolves({ productId: 'product1', quantity: 10, name: 'Product 1' });
    findOneProductStub.withArgs({ where: { productId: 'product2' } }).resolves({ productId: 'product2', quantity: 10, name: 'Product 2' });
    findOneCartItemStub.withArgs({ where: { cartId: 'cart1', productId: 'product1' } }).resolves({ cartId: 'cart1', productId: 'product1' });
    findOneCartItemStub.withArgs({ where: { cartId: 'cart1', productId: 'product2' } }).resolves({ cartId: 'cart1', productId: 'product2' });
    updateCartItemStub.resolves([1]);
    findAllCartItemStub.resolves(updates);
    sumCartItemStub.resolves(45);

    const response = await request(app)
      .post('/updatecart')
      .send({ updates });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Cart items updated successfully!');
    expect(response.body).toHaveProperty('cartItems');
    expect(response.body).toHaveProperty('total');
  });
});

