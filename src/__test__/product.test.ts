import request from 'supertest';
import sinon from 'sinon';
import { productLifecycleEmitter, PRODUCT_ADDED } from '../helpers/events';
import { NextFunction,Request,Response } from 'express';
import setupServer from '../helpers/createServer';
import { server } from '..';
jest.setTimeout(50000);
let app = setupServer()


beforeAll(() => {

});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve)); // Close the server after all tests have finished
});


jest.mock('../middleware/verfiyToken', () => {
  return {
    VerifyAccessToken: (req:Request, res:Response, next:NextFunction) => {
      (req as any).token = { userId: 'test-user' }; 
      next();
    }
  };
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
