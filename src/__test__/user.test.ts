import request from 'supertest';
import sinon from 'sinon';
import { app, server } from '../index';
import User from '../database/models/user';
import nodemailer from 'nodemailer';
import Vendor from '../database/models/vendor';


beforeAll(() => {
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
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



