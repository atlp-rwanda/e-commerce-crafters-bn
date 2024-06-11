import request from 'supertest';
import express, { Application } from 'express';
import { readAllProducts, readProduct, searchProduct } from '../controllers/product.controller';
import Product from '../database/models/product';
import { getAllProducts, searchProducts } from '../services/productService';

const app: Application = express();
app.use(express.json());

app.get('/products', readAllProducts);
app.get('/products/:id', readProduct);
app.get('/search', searchProduct);

jest.mock('../services/productService');
jest.mock('../database/models/product');

let server;

beforeAll(() => {
  server = app.listen(5000);
});

afterAll(async () => {
  await new Promise(resolve => {
    server.close(resolve);
  });
});

describe('Product Controller', () => {
  describe('readAllProducts', () => {
    it('should return products with status 200', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app).get('/products?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });

    it('should return 404 if no products found', async () => {
      (getAllProducts as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/products?page=1&limit=10');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "No products found" });
    });

    it('should handle errors', async () => {
      (getAllProducts as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/products');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database Error' });
    });
  });

  describe('readProduct', () => {
    it('should return a product with status 200', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app).get('/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/products/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Product not found" });
    });

    it('should handle errors', async () => {
      (Product.findByPk as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/products/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database Error' });
    });
  });

  describe('searchProduct', () => {
    it('should return products matching the search criteria with status 200', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      (searchProducts as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app).get('/search?name=Test&category=Electronics&page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });

    it('should return 404 if no products match the search criteria', async () => {
      (searchProducts as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/search?name=Test&category=Electronics&page=1&limit=10');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "No products found" });
    });

    it('should handle errors', async () => {
      (searchProducts as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/search?name=Test&category=Electronics&page=1&limit=10');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database Error' });
    });
  });
});
