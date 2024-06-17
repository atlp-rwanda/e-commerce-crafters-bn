import request from 'supertest';
import Order from "../database/models/order";
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { app, server } from "..";

function generateToken() {
  const payload = { userId: 'test-user' };
  const secret = process.env.JWT_SECRET || 'crafters1234';
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
}

jest.setTimeout(50000);


beforeAll(() => {
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});


describe('getOrderStatus', () => {
  let findOneStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Order, 'findOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should get order status", async () => {
    const orderId = '123';
    findOneStub.resolves({ orderId, status: 'processing' });
    const token = generateToken();

    const res = await request(app)
      .get(`/order/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ orderId: '123', status: 'processing' });
  });

  it("should return 404 if order not found", async() => {
    findOneStub.resolves(null);
    const token = generateToken();

    const res = await request(app)
      .get(`/order/123/status`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Order not found'); ;
    

  })

  it("should return 500 if there is an internal server error", async() => {
    findOneStub.rejects(new Error('Internal server error'));
    const token = generateToken();

    const res = await request(app)
      .get(`/order/123/status`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    

  })
});
