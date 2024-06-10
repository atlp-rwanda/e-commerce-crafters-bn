import { Request, Response } from "express";
import { deleteUser } from "../controllers/user.controller";
import { deleteUserById } from "../services/userService";
import User from "../database/models/user";
import request from 'supertest';
import sinon from 'sinon';
import { app, server } from '../index';
import nodemailer from 'nodemailer';
import Vendor from '../database/models/vendor';
import * as passwordUtils from '../services/userService';


jest.setTimeout(50000);

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

jest.mock("../services/userService");
jest.mock("../database/models/user");


const mockDeleteUserById = deleteUserById as jest.MockedFunction<
  typeof deleteUserById
>;
const mockFindByPk = User.findByPk as jest.MockedFunction<typeof User.findByPk>;

describe("deleteUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = { params: { id: "1" } };
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = { status } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete  user and return a success message", async () => {
    mockFindByPk.mockResolvedValue({
      destroy: jest.fn().mockResolvedValueOnce(true),
    } as any);

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "User deleted successful" });
  });

  it("should return status 500 error if an exception occurs", async () => {
    mockDeleteUserById.mockRejectedValueOnce(
      new Error("Internal server error")
    );

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("should return  status 404  if user is not found", async () => {
    mockDeleteUserById.mockImplementationOnce(() => {
      throw new Error("user not found");
    });

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "User not found" });
  });
});



describe('register', () => {
  let createStub: sinon.SinonStub;
  let findOneStub: sinon.SinonStub;
  let sendMailStub: sinon.SinonStub;
  let transportStub: any;

  beforeAll(() => {
    createStub = sinon.stub(User, 'create');
    findOneStub = sinon.stub(User, 'findOne');

    transportStub = {
      sendMail: sinon.stub().resolves(true)
    };
    sinon.stub(nodemailer, 'createTransport').returns(transportStub);
  });

  afterAll(() => {
    createStub.restore();
    findOneStub.restore();
    (nodemailer.createTransport as sinon.SinonStub).restore();
  });

  it('should return 400 if name, email, or password is not provided', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please fill all fields');
  });

  it('should return 409 if email already exists', async () => {
    findOneStub.resolves({ id: 1, email: 'duplicate@example.com' });

    const res = await request(app)
      .post('/register')
      .send({ name: 'John Doe', email: 'duplicate@example.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.Message).toBe('Email already exists');
  });

  it('should return 201 and save user successfully', async () => {
    const newUser = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedpassword'
    };
    findOneStub.resolves(null);
    createStub.resolves(newUser);
    transportStub.sendMail.resolves({ accepted: ['test@example.com'] });

    const res = await request(app)
      .post('/register')
      .send({ name: 'John Doe', email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
    expect(res.body.user).toEqual(newUser);
    expect(res.body.email).toBe('Email sent to your email address');
  });

  it('should return 500 if there is an internal server error', async () => {
    createStub.rejects(new Error('Internal server error')); 

    const res = await request(app)
    .post('/register')
    .send({ name: 'John Doe', email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
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

describe("Welcome endpoint",()=>{
    
    it('should return welcome message and status 200 ', async()=>{
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain("<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>");
    });
})

