import request from 'supertest';
import sinon from 'sinon';
import { productLifecycleEmitter } from '../helpers/events';
import { app, server } from '..';
import Product from '../database/models/product';
import  jwt  from 'jsonwebtoken';


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

    const token = generateToken();

    const res = await request(app)
      .post('/create/product/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to save data');
  });

  it('should return 201 if product is created successfully', async () => {
    checkVendorPermissionStub.resolves({ allowed: true });
    saveProductStub.resolves({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    const token = generateToken();

    const res = await request(app)
      .post('/create/product/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Product Created');
    expect(res.body.data).toEqual({ id: '1', name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorPermissionStub.rejects(new Error('Internal server error'));

    const token = generateToken();

    const res = await request(app)
      .post('/create/product/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Product1', image: 'image.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('updateProduct', () => {
  let checkVendorModifyPermissionStub: sinon.SinonStub;
  let productFindByPkStub: sinon.SinonStub;
  let productUpdateStub: sinon.SinonStub;
  let productLifecycleEmitterStub: sinon.SinonStub;

  beforeEach(() => {
    checkVendorModifyPermissionStub = sinon.stub(require('../services/PermisionService'), 'checkVendorModifyPermission');
    productFindByPkStub = sinon.stub(Product, 'findByPk');
    productUpdateStub = sinon.stub(Product, 'update');
    productLifecycleEmitterStub = sinon.stub(productLifecycleEmitter, 'emit');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 404 if product is not found', async () => {
    checkVendorModifyPermissionStub.resolves({ allowed: true });
    productFindByPkStub.resolves(null);

    const token = generateToken();

    const res = await request(app)
      .put('/updateProduct/123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vendorId: 'vendor1',
        name: 'Updated Product',
        image: 'updated_image.png',
        description: 'Updated description',
        price: 200,
        quantity: 20,
        category: 'Electronics'
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });

  it('should return 403 if vendor does not have permission to modify the product', async () => {
    checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'Permission denied' });

    const token = generateToken();

    const res = await request(app)
      .put('/updateProduct/123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vendorId: 'vendor1',
        name: 'Updated Product',
        image: 'updated_image.png',
        description: 'Updated description',
        price: 200,
        quantity: 20,
        category: 'Electronics'
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Permission denied');
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));

    const token = generateToken();

    const res = await request(app)
      .put('/updateProduct/123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vendorId: 'vendor1',
        name: 'Updated Product',
        image: 'updated_image.png',
        description: 'Updated description',
        price: 200,
        quantity: 20,
        category: 'Electronics'
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  it('should update the product successfully', async () => {
    const updatedProduct = {
      id: '123',
      name: 'Updated Product',
      image: 'updated_image.png',
      description: 'Updated description',
      price: 200,
      quantity: 20,
      category: 'Electronics'
    };

    checkVendorModifyPermissionStub.resolves({ allowed: true });
    productFindByPkStub.resolves({ update: sinon.stub().resolves(updatedProduct) });

    const token = generateToken();

    const res = await request(app)
      .put('/updateProduct/123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vendorId: 'vendor1',
        name: 'Updated Product',
        image: 'updated_image.png',
        description: 'Updated description',
        price: 200,
        quantity: 20,
        category: 'Electronics'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product updated successfully');
  });
});
