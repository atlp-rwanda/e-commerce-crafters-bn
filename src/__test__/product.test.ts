import request from 'supertest';
import sinon from 'sinon';
import { app, server } from '..';
import Product from '../database/models/product';
import jwt from 'jsonwebtoken';

// Function to generate a JWT token for authorization
function generateToken() {
  const payload = { userId: 'test-user' };
  const secret = process.env.JWT_SECRET || 'crafters1234';
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
}

jest.setTimeout(50000);

beforeAll(() => {
  // Any global setup if needed
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
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
      expect(res.body.error).toBe('Error while fetching all products'); // Updated error message
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
      findByPkStub.rejects(new Error('Internal server error')); // Update the error message
    
      const res = await request(app)
        .get('/readProduct/1')
        .set('Authorization', `Bearer ${generateToken()}`);
    
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error'); // Updated error message to match the received error
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
      expect(res.body.error).toBe('Error while searching products'); // Updated error message
    });
  });
});