import request from 'supertest';
import { app, server } from '../index';
import sinon from 'sinon';
import Vendor from '../database/models/vendor';

jest.setTimeout(50000);

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
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
