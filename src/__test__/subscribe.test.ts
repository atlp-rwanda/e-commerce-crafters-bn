import request from 'supertest';
import { app, server } from '../index';
import sinon from 'sinon';
import User from '../database/models/user';
import * as subscriptionService from '../services/subscription.service';
import Subscription from '../database/models/subscription';

jest.setTimeout(50000);

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe('Subscription Tests', () => {
  let findUserStub;
  let findSubscriptionStub;
  let createSubscriptionStub;
  let registerSubscriptionStub;
  let unsubscribeStub;

  beforeEach(() => {
    findUserStub = sinon.stub(User, 'findOne');
    findSubscriptionStub = sinon.stub(Subscription, 'findOne');
    createSubscriptionStub = sinon.stub(Subscription, 'create');
    registerSubscriptionStub = sinon.stub(subscriptionService, 'registerSubscription');
    unsubscribeStub = sinon.stub(subscriptionService, 'unsubscribe');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /save-subscription', () => {
    it('should return 404 if user is not found', async () => {
      findUserStub.resolves(null);

      const res = await request(app).post('/save-subscription').send({ email: 'test@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 403 if email already exists in subscriptions', async () => {
      findUserStub.resolves({ id: 1, email: 'test@example.com' });
      findSubscriptionStub.resolves({ id: 1, email: 'test@example.com' });

      const res = await request(app).post('/save-subscription').send({ email: 'test@example.com' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Email already exists');
    });

    it('should return 400 if email is not provided', async () => {
      const res = await request(app).post('/save-subscription').send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is required');
    });

    it('should return 500 if saving subscription fails', async () => {
      findUserStub.resolves({ id: 1, email: 'test@example.com' });
      findSubscriptionStub.resolves(null);
      registerSubscriptionStub.resolves(false);

      const res = await request(app).post('/save-subscription').send({ email: 'test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to save subscription');
    });

    it('should return 201 if subscription is created successfully', async () => {
      findUserStub.resolves({ id: 1, email: 'test@example.com' });
      findSubscriptionStub.resolves(null);
      registerSubscriptionStub.resolves({ id: 1, email: 'test@example.com' });

      const res = await request(app).post('/save-subscription').send({ email: 'test@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Subscription Created');
      expect(res.body.data).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return 500 for an internal server error', async () => {
      findUserStub.rejects(new Error('Internal server error'));

      const res = await request(app).post('/save-subscription').send({ email: 'test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('DELETE /unsubscribe', () => {
    it('should return 200 if subscription is deleted successfully', async () => {
      unsubscribeStub.resolves();

      const res = await request(app).delete('/unsubscribe').send({ email: 'test@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Subscription deleted successfully');
    });

    it('should return 400 if email is not provided', async () => {
      const res = await request(app).delete('/unsubscribe').send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is required');
    });

    it('should return 500 if there is an error deleting the subscription', async () => {
      unsubscribeStub.rejects(new Error('Subscription not found'));

      const res = await request(app).delete('/unsubscribe').send({ email: 'test@example.com' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Subscription not found');
    });
  });
});
