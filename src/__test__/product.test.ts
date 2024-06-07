import request from 'supertest';
import sinon from 'sinon';
import { app, closeServer, startServer } from '../index';
import { productLifecycleEmitter, PRODUCT_ADDED } from '../helpers/events';
import { NextFunction,Request,Response } from 'express';

jest.mock('../middleware/verfiyToken', () => {
  return {
    VerifyAccessToken: (req:Request, res:Response, next:NextFunction) => {
      (req as any).token = { userId: 'test-user' }; 
      next();
    }
  };
});

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await closeServer();
});

describe('createProduct', () => {
  let checkVendorPermissionStub: sinon.SinonStub;
  let saveProductStub: sinon.SinonStub;
  let productLifecycleEmitterStub: sinon.SinonStub;

  beforeEach(() => {
    checkVendorPermissionStub = sinon.stub(require('../services/PermisionService'), 'checkVendorPermission');
    saveProductStub = sinon.stub(require('../services/productService'), 'saveProduct');
    productLifecycleEmitterStub = sinon.stub(productLifecycleEmitter, 'emit');
  });

  afterEach(() => {
    checkVendorPermissionStub.restore();
    saveProductStub.restore();
    productLifecycleEmitterStub.restore();
  });

  it('should return 403 if vendor permission is not allowed', async () => {
    checkVendorPermissionStub.resolves({ allowed: false, status: 403, message: 'Permission denied' });

    const res = await request(app).post('/create/product/123')
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Permission denied');
  });

  it('should return 500 if saving product fails', async () => {
    checkVendorPermissionStub.resolves({ allowed: true });
    saveProductStub.resolves(null);

    const res = await request(app).post('/create/product/123')
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to save data');
  });

  it('should return 201 if product is created successfully', async () => {
    checkVendorPermissionStub.resolves({ allowed: true });
    saveProductStub.resolves({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    const res = await request(app).post('/create/product/123')
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Product Created');
    expect(res.body.data).toEqual({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorPermissionStub.rejects(new Error('Internal server error'));

    const res = await request(app).post('/create/product/123')
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
