import { createOrder } from '../controllers/checkout.controller';
import { Request, Response } from 'express';
import { mocked } from 'jest-mock';
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
    mocked(Cart.findOne).mockResolvedValueOnce(null);
    await createOrder(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found' });
  });

});
