import { createOrder } from '../controllers/checkout.controller';
import { Request, Response } from 'express';
import Order from '../database/models/order';
import Cart from '../database/models/cart';
import CartItem from '../database/models/cartitem';

jest.mock('../database/models/order');
jest.mock('../database/models/cart');
jest.mock('../database/models/cartitem');

describe('createOrder', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        userId: 'user123',
        deliveryAddress: '123 Main St',
        paymentMethod: 'credit_card',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if userId, deliveryAddress, or paymentMethod is missing', async () => {
    delete req.body.userId;
    await createOrder(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('should return 404 if cart is not found', async () => {
    console.log('Test: should return 404 if cart is not found');
    (Cart.findOne as jest.Mock).mockResolvedValueOnce(null);

    await createOrder(req as Request, res as Response);


    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' });
  });

  it('should return 400 if cart is empty', async () => {
    const cart = { cartId: 'cart123' };
    (Cart.findOne as jest.Mock).mockResolvedValueOnce(cart);
    (CartItem.findAll as jest.Mock).mockResolvedValueOnce([]);

    await createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your cart is empty' });
  });

  it('should create order and delete cart items if cart is not empty', async () => {
    const cart = { cartId: 'cart123' };
    const cartItems = [{ productId: 'product123', quantity: 2, price: 10 }];

    (Cart.findOne as jest.Mock).mockResolvedValueOnce(cart);
    (CartItem.findAll as jest.Mock).mockResolvedValueOnce(cartItems);
    (Order.create as jest.Mock).mockResolvedValueOnce({ orderId: 'order123' });

    await createOrder(req as Request, res as Response);

    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
      deliveryAddress: req.body.deliveryAddress,
      userId: req.body.userId,
      paymentMethod: req.body.paymentMethod,
      status: 'pending',
      products: cartItems,
      totalAmount: cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
    }));
    expect(CartItem.destroy).toHaveBeenCalledWith({ where: { cartId: cart.cartId } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order placed successfully', order: { orderId: 'order123' } });
  });
});
