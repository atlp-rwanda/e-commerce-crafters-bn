import request from 'supertest';
import { server, app } from '..';
import sinon from 'sinon';
import User from '../database/models/user';
import * as passwordUtils from '../services/userService';

jest.setTimeout(50000);

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe('PATCH /updateuser/', () => {
  let findOneUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;

  beforeEach(() => {
    findOneUserStub = sinon.stub(User, 'findOne');
    updateUserStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 404 if user not found', async () => {
    findOneUserStub.resolves(null);

    const response = await request(app)
      .patch('/updateuser/1')
      .send({ name: 'New Name' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should return 403 if email already exists', async () => {
    findOneUserStub
      .onFirstCall().resolves({ userId: 1 })
      .onSecondCall().resolves({ userId: 2 });

    const response = await request(app)
      .patch('/updateuser/1')
      .send({ email: 'existing@example.com' });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Email already exists');
  });

  it('should update user successfully', async () => {
    const mockUser = { userId: 1, save: jest.fn().mockResolvedValue({ userId: 1, name: 'New Name' }) };
    findOneUserStub.resolves(mockUser as any);

    const response = await request(app)
      .patch('/updateuser/1')
      .send({ name: 'New Name' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User update success');
    expect(response.body).toHaveProperty('user', { userId: 1, name: 'New Name' });
  });

 
});

describe('PATCH /updatepassword/', () => {
  let findOneUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;
  let comparePasswordStub: sinon.SinonStub;
  let hashPasswordStub: sinon.SinonStub;

  beforeEach(() => {
    findOneUserStub = sinon.stub(User, 'findOne');
    updateUserStub = sinon.stub(User.prototype, 'save');
    comparePasswordStub = sinon.stub(passwordUtils, 'comparePassword');
    hashPasswordStub = sinon.stub(passwordUtils, 'hashPassword');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 404 if user not found', async () => {
    findOneUserStub.resolves(null);

    const response = await request(app)
      .patch('/updatepassword/1')
      .send({ password: 'oldPass', newPassword: 'newPass', confirmPassword: 'newPass' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should return 400 if fields are missing', async () => {
    findOneUserStub.resolves({ userId: 1, password: 'hashedOldPass' } as any);
    comparePasswordStub.resolves(false);

    const response = await request(app)
      .patch('/updatepassword/1')
      .send({ password: 'oldPass', newPassword: 'newPass' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Please fill all fields');
  });

  it('should return 400 if old password is incorrect', async () => {
    findOneUserStub.resolves({ userId: 1, password: 'hashedOldPass' } as any);
    comparePasswordStub.resolves(false);

    const response = await request(app)
      .patch('/updatepassword/1')
      .send({ password: 'wrongOldPass', newPassword: 'newPass', confirmPassword: 'newPass' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Wrong password');
  });

  it('should return 400 if new passwords do not match', async () => {
    findOneUserStub.resolves({ userId: 1, password: 'hashedOldPass' } as any);
    comparePasswordStub.resolves(true);

    const response = await request(app)
      .patch('/updatepassword/1')
      .send({ password: 'oldPass', newPassword: 'newPass', confirmPassword: 'differentNewPass' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', "Passwords don't match");
  });

  it('should update password successfully', async () => {
    const mockUser = { userId: 1, password: 'hashedOldPass', save: jest.fn().mockResolvedValue({ userId: 1, password: 'hashedNewPass' }) };
    findOneUserStub.resolves(mockUser as any);
    comparePasswordStub.resolves(true);
    hashPasswordStub.resolves('hashedNewPass');

    const response = await request(app)
      .patch('/updatepassword/1')
      .send({ password: 'oldPass', newPassword: 'newPass', confirmPassword: 'newPass' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Password updated successfully');
    expect(response.body).toHaveProperty('user', { userId: 1, password: 'hashedNewPass' });
  });

});
