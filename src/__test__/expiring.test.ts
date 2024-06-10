import sinon from 'sinon';
import { checkExpiringProducts } from "../helpers/expiring";
import Product from '../database/models/product';
import Vendor from '../database/models/vendor';
import User from '../database/models/user';
import { server } from '..';

afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
  });

describe("CheckExpiringProducts", () => {
  let productFindAllStub:sinon.SinonStub;
  let vendorFindAllStub:sinon.SinonStub;
  let userFindAllStub:sinon.SinonStub;
  beforeEach(() => {
    productFindAllStub = sinon.stub(Product, 'findAll');
    vendorFindAllStub = sinon.stub(Vendor, 'findAll');
    userFindAllStub = sinon.stub(User, 'findAll');
  });
  afterEach(() => {
    productFindAllStub.restore();
    vendorFindAllStub.restore();
    userFindAllStub.restore();
  });

  it("Should return an object or false", async () => {
    productFindAllStub.resolves([
      { toJSON: () => ({ name: 'Product 1', expiringDate: new Date(), vendorId: 'vendor1' }) },
      { toJSON: () => ({ name: 'Product 2', expiringDate: new Date(), vendorId: 'vendor2' }) }
    ]);

    vendorFindAllStub.resolves([
      { toJSON: () => ({ vendorId: 'vendor1', userId: 'user1' }) },
      { toJSON: () => ({ vendorId: 'vendor2', userId: 'user2' }) }
    ]);
    userFindAllStub.resolves([
      { toJSON: () => ({ userId: 'user1', email: 'test1@example.com' }) },
      { toJSON: () => ({ userId: 'user2', email: 'test2@example.com' }) }
    ]);

    const result = await checkExpiringProducts();
    expect(typeof result === "boolean" || typeof result === "object").toBe(true);
  });

  it("Check if the keys are emails and values are arrays of strings of products", async () => {
    productFindAllStub.resolves([
      { toJSON: () => ({ name: 'Product 1', expiringDate: new Date(), vendorId: 'vendor1' }) },
      { toJSON: () => ({ name: 'Product 2', expiringDate: new Date(), vendorId: 'vendor2' }) }
    ]);

    vendorFindAllStub.resolves([
      { toJSON: () => ({ vendorId: 'vendor1', userId: 'user1' }) },
      { toJSON: () => ({ vendorId: 'vendor2', userId: 'user2' }) }
    ]);

    userFindAllStub.resolves([
      { toJSON: () => ({ userId: 'user1', email: 'test1@example.com' }) },
      { toJSON: () => ({ userId: 'user2', email: 'test2@example.com' }) }
    ]);

    const result = await checkExpiringProducts();
    if (typeof result === "object") {
      for (const key in result) {
        expect(validateEmail(key)).toBe(true);
        expect(Array.isArray(result[key])).toBe(true);
        result[key].forEach((product) => {
          expect(typeof product).toBe("string");
        });
      }
    }
  });

  it("Should handle no expiring products case", async () => {
    productFindAllStub.resolves([]);

    const result = await checkExpiringProducts();
    expect(result).toBe(false);
  });

});

function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

