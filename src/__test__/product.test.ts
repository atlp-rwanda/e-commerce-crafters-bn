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
    sinon.restore();
  });

  it('should return 404 if product not found', async () => {
    checkVendorModifyPermissionStub.resolves({ allowed: true });
    findByPkStub.resolves(null);
    
    const token = generateToken();
    const res = await request(app)
      .delete('/deleteProduct/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ vendorId: '123' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });

  it('should return 403 if permission denied', async () => {
    checkVendorModifyPermissionStub.resolves({ allowed: false, status: 403, message: 'You are not allowed to perform this action' });
    findByPkStub.resolves({});
    
    const token = generateToken();

    const res = await request(app)
      .delete('/deleteProduct/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ vendorId: '123' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not allowed to perform this action');
  });

  it('should delete product and return 200 if successful', async () => {
    checkVendorModifyPermissionStub.resolves({ allowed: true });
    const product = { destroy: destroyStub };
    findByPkStub.resolves(product);
    
    destroyStub.resolves();

    const token = generateToken();

    const res = await request(app)
      .delete('/deleteProduct/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ vendorId: '123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });

  it('should return 500 if there is an internal server error', async () => {
    checkVendorModifyPermissionStub.rejects(new Error('Internal server error'));

    const token = generateToken();
    const res = await request(app)
      .delete('/deleteProduct/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ vendorId: '123' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('Product Read Operations', () => {
  let findAllStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  beforeEach(() => {
    findAllStub = sinon.stub(Product, 'findAll');
    findByPkStub = sinon.stub(Product, 'findByPk');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Get all products', () => {
    it('should return 200 and all products', async () => {
      const products = [
        { id: '1', name: 'Product1', image: 'image1.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' },
        { id: '2', name: 'Product2', image: 'image2.png', description: 'Another product', price: 150, quantity: 5, category: 'Books' }
      ];

      findAllStub.resolves(products);

      const res = await request(app)
        .get('/readAllProducts')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(products);
    });

    it('should return 404 if no products are found', async () => {
      findAllStub.resolves([]);

      const res = await request(app)
        .get('/readAllProducts')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No products found');
    });

    it('should return 500 if there is an internal server error', async () => {
      findAllStub.rejects(new Error('Internal server error'));

      const res = await request(app)
        .get('/readAllProducts')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Error while fetching all products'); 
    });
  });

  describe('Get product by ID', () => {
    it('should return 200 and the product details', async () => {
      const product = { id: '1', name: 'Product1', image: 'image1.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' };

      findByPkStub.resolves(product);

      const res = await request(app)
        .get('/readProduct/1')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(product);
    });

    it('should return 404 if the product is not found', async () => {
      findByPkStub.resolves(null);

      const res = await request(app)
        .get('/readProduct/999')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });

    it('should return 500 if there is an internal server error', async () => {
      findByPkStub.rejects(new Error('Internal server error')); 
    
      const res = await request(app)
        .get('/readProduct/1')
        .set('Authorization', `Bearer ${generateToken()}`);
    
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error'); 
    });
  });

  describe('Search products', () => {
    it('should return 200 and matching products', async () => {
      const searchResults = [
        { id: '1', name: 'Product1', image: 'image1.png', description: 'A great product', price: 100, quantity: 10, category: 'Electronics' },
        { id: '3', name: 'Electronics Product', image: 'image3.png', description: 'Another great electronic product', price: 200, quantity: 15, category: 'Electronics' }
      ];

      findAllStub.resolves(searchResults);

      const res = await request(app)
        .get('/products/search?name=Product&category=Electronics')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(searchResults);
    });

    it('should return 404 if no products match the search criteria', async () => {
      findAllStub.resolves([]);

      const res = await request(app)
        .get('/products/search?name=NonExisting&category=NonExistingCategory')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No products found');
    });

    it('should return 500 if there is an internal server error', async () => {
      findAllStub.rejects(new Error('Internal server error'));

      const res = await request(app)
        .get('/products/search?name=Product&category=Electronics')
        .set('Authorization', `Bearer ${generateToken()}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Error while searching products'); 
    });
  });
});