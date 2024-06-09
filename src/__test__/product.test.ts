import request from 'supertest';
import sinon from 'sinon';
import { productLifecycleEmitter, PRODUCT_ADDED } from '../helpers/events';
import { NextFunction, Request, Response } from 'express';
import setupServer from '../helpers/createServer';
import Product from '../database/models/product';
import { checkVendorModifyPermission } from '../services/PermisionService';
import { app, server } from '..';
jest.setTimeout(50000);

beforeAll(() => {});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

jest.mock('../middleware/verfiyToken', () => {
  return {
    VerifyAccessToken: (req: Request, res: Response, next: NextFunction) => {
      (req as any).token = { userId: 'test-user' };
      next();
    }
  };
});



describe('deleteProduct', () => {
  let checkVendorModifyPermissionStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let destroyStub: sinon.SinonStub;
  let productLifecycleEmitterStub: sinon.SinonStub;

  beforeEach(() => {
    checkVendorModifyPermissionStub = sinon.stub(require('../services/PermisionService'), 'checkVendorModifyPermission');
    findByPkStub = sinon.stub(Product, 'findByPk');
    destroyStub = sinon.stub(Product.prototype, 'destroy');
    productLifecycleEmitterStub = sinon.stub(productLifecycleEmitter, 'emit');
  });

  afterEach(() => {
    checkVendorModifyPermissionStub.restore();
    findByPkStub.restore();
    destroyStub.restore();
    productLifecycleEmitterStub.restore();
  });

  it('should return 404 if product not found', async () => {
    findByPkStub.resolves(null);
    checkVendorModifyPermissionStub.resolves({ allowed: true });

    const res = await request(app)
      .delete('/deleteProduct/1')
      .send({ vendorId: '123' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });

  it('should return 403 if permission denied', async () => {
    findByPkStub.resolves({});
    checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'You are not allowed to perform this action' });

    const res = await request(app)
      .delete('/deleteProduct/1')
      .send({ vendorId: '123' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not allowed to perform this action');
  });

  it('should delete product and return 200 if successful', async () => {
    const product = { destroy: destroyStub };
    findByPkStub.resolves(product);
    checkVendorModifyPermissionStub.resolves({ allowed: true });
    destroyStub.resolves();

    const res = await request(app)
      .delete('/deleteProduct/1')
      .send({ vendorId: '123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));

    const res = await request(app)
      .delete('/deleteProduct/1')
      .send({ vendorId: '123' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('updateProduct', () => {
  let checkVendorModifyPermissionStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let productLifecycleEmitterStub: sinon.SinonStub;

  beforeEach(() => {
    checkVendorModifyPermissionStub = sinon.stub(require('../services/PermisionService'), 'checkVendorModifyPermission');
    findByPkStub = sinon.stub(Product, 'findByPk');
    updateStub = sinon.stub(Product.prototype, 'update');
    productLifecycleEmitterStub = sinon.stub(productLifecycleEmitter, 'emit');
  });

  afterEach(() => {
    checkVendorModifyPermissionStub.restore();
    findByPkStub.restore();
    updateStub.restore();
    productLifecycleEmitterStub.restore();
  });

  it('should return 404 if product not found', async () => {
    findByPkStub.resolves(null);
    checkVendorModifyPermissionStub.resolves({ allowed: true})

    const res = await request(app)
      .put('/updateProduct/1')
      .send({ vendorId: '123', name: 'Updated Product', price: 200 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });

  it('should return 403 if permission denied', async () => {
    findByPkStub.resolves({});
    checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'You are not allowed to perform this action'  });

    const res = await request(app)
      .put('/updateProduct/1')
      .send({ vendorId: '123', name: 'Updated Product', price: 200 });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not allowed to perform this action');
  });

  it('should update product and return 200 if successful', async () => {
    
    const product = { update: updateStub, 
      toJSON: () => ({ vendorId: '123', name: 'Updated Product', description: 'Updated description' })
    }
    findByPkStub.resolves(product)
    checkVendorModifyPermissionStub.resolves({ allowed: true });
    updateStub.resolves();
    
    

    const res = await request(app)
      .put('/updateProduct/1')
      .send({ vendorId: '123', name: 'Updated Product', description: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product updated successfully');
    expect(res.body.product).toEqual({ vendorId: '123', name: 'Updated Product', description: 'Updated description' });
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));

    const res = await request(app)
      .put('/updateProduct/1')
      .send({ vendorId: '123', name: 'Updated Product', price: 200 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
