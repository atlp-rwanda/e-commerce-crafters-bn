
import { Request, Response } from "express";
import { deletingVendor } from "../controllers/vendor.controller";
import { deleteVendorById } from "../services/vendorServices";
import Vendor from "../database/models/vendor";
import request from 'supertest';
import sinon from 'sinon';
import { app, server } from '../index';
import User from '../database/models/user';
import { error } from "console";



jest.setTimeout(50000);

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("Vendor Deletion", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: sinon.SinonSpy;
  let status: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  beforeEach(() => {
    req = { params: { id: "1" } };
    json = sinon.spy();
    status = sinon.stub().returns({ json });
    res = { status } as unknown as Response;

    findByPkStub = sinon.stub(Vendor, "findByPk");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return status 200 and success message if vendor is deleted", async () => {
    const destroyStub = sinon.stub().resolves(true);
    findByPkStub.resolves({
      destroy: destroyStub,
    } as any);

    await deletingVendor(req as Request, res as Response);

    sinon.assert.calledOnce(findByPkStub);
    sinon.assert.calledOnce(destroyStub);
    sinon.assert.calledWith(status, 200);
    sinon.assert.calledWith(json, { message: "Vendor deleted successful" });
  });

  it("should return status 500 and error message if an exception occurs", async () => {
    findByPkStub.rejects(new Error("Internal server error"));

    await deletingVendor(req as Request, res as Response);

    sinon.assert.calledOnce(findByPkStub);
    sinon.assert.calledWith(status, 500);
    sinon.assert.calledWith(json, { error: "Internal server error" });
  });

  it("should return status 404 and error message if vendor is not found", async () => {
    findByPkStub.resolves(null);

    await deletingVendor(req as Request, res as Response);

    sinon.assert.calledOnce(findByPkStub);
  
    sinon.assert.calledWith(json, { error: "Vendor not found" });
  });
});


describe('registerVendor', () => {
    let createStub: sinon.SinonStub;
    let findOneStub: sinon.SinonStub;
  
    beforeAll(() => {
      createStub = sinon.stub(Vendor, 'create');
      findOneStub = sinon.stub(User, 'findOne');
    });
  
    afterAll((done) => {
      createStub.restore();
      findOneStub.restore();
      if (server.listening) {
        server.close(done);
      } else {
        done();
      }
    });
  
    it('should return 400 if userId, storeName, address, TIN, bankAccount, and paymentDetails are not provided', async () => {
      const res = await request(app)
        .post('/requestVendor')
        .send({ userIds: "user123", storeNames: "storeName", address: "address", TINs: 784378, bankAccounts: 853509345, paymentDetail: "momo pay" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please fill all fields');
    });
  
    it('should return 200 and vendor saved successfully', async () => {
      const newVendor = {
        userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129",
        storeName: "storeName",
        address: "address",
        TIN: 784378,
        bankAccount: 853509345,
        paymentDetails: "momo pay"
      };

      findOneStub.resolves({ id: '5d7f1cce-8dc4-4e9c-b426-11fbda9f4129' });
      createStub.resolves(newVendor);
      
      const res = await request(app)
        .post('/requestVendor')
        .send({ userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
  
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Vendor requested successfully');
      expect(res.body.vendor).toEqual(newVendor);
    });
  
    it('should return 500 if there is an internal server error', async () => {
      findOneStub.resolves({ id: '5d7f1cce-8dc4-4e9c-b426-11fbda9f4129' });
      createStub.rejects(new Error('Internal server error'));
  
      const res = await request(app)
        .post('/requestVendor')
        .send({ userId: "5d7f1cce-8dc4-4e9c-b426-11fbda9f4129", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });

    it('should return 404 if user is not found', async () => {
      findOneStub.resolves(null);
  
      const res = await request(app)
        .post('/requestVendor')
        .send({ userId: "nonexistentUser", storeName: "storeName", address: "address", TIN: 784378, bankAccount: 853509345, paymentDetails: "momo pay" });
  
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

describe('PATCH /updateVendor/', () => {
  let findOneVendorStub: sinon.SinonStub;
  let updateVendorStub: sinon.SinonStub;

  beforeEach(() => {
    findOneVendorStub = sinon.stub(Vendor, 'findOne');
    updateVendorStub = sinon.stub(Vendor.prototype, 'save');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 404 if vendor not found', async () => {
    findOneVendorStub.resolves(null);

    const response = await request(app)
      .patch('/updateVendor/1')
      .send({ name: 'New Vendor Name' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Vendor not found');
  });

  it('should update vendor successfully', async () => {
    const mockVendor = { vendorId: '1', name: 'Existing Vendor Name', save: jest.fn().mockResolvedValue({ vendorId: '1', name: 'New Vendor Name' }) };
    findOneVendorStub.resolves(mockVendor as any);

    const response = await request(app)
      .patch('/updateVendor/1')
      .send({ name: 'New Vendor Name' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Vendor update success');
    expect(response.body).toHaveProperty('vendor');
    expect(response.body.vendor).toEqual({ vendorId: '1', name: 'New Vendor Name' });
  });

  it('should return 500 if there is a database error', async () => {
    findOneVendorStub.rejects(new Error('Database error'));

    const response = await request(app)
      .patch('/updateVendor/1')
      .send({ name: 'New Vendor Name' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal server error');
  });
});
