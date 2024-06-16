import request from 'supertest';
import sinon from 'sinon';

import  Rating  from '../database/models/rating'; 
import Review from '../database/models/review';
import Order from '../database/models/order';
import setupServer from '../helpers/createServer';
import { app, server } from '..';



beforeAll(() => {

});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve)); 
});


describe('addReview', () => {
  let findOneOrderStub: sinon.SinonStub;
  let createReviewStub: sinon.SinonStub;

  beforeAll(() => {
    findOneOrderStub = sinon.stub(Order, 'findOne');
    createReviewStub = sinon.stub(Review, 'create');
  });

  afterAll((done) => {
    findOneOrderStub.restore();
    createReviewStub.restore();
    done()
  });

  it('should return 402 if rating is above 5', async () => {
    const res = await request(app).post('/addreview/123')
      .send({ productId: '456', rating: 6, feedback: 'Great product!' });

    expect(res.status).toBe(402);
    expect(res.body.message).toBe('Rating is between 0 and 5');
  });

  it('should return 400 if user has not bought the product', async () => {
    findOneOrderStub.resolves(null);

    const res = await request(app)
      .post('/addreview/123')
      .send({ productId: '456', rating: 4, feedback: 'Great product!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(' User has not bougth this product');
  });

  it('should return 200 and create review successfully', async () => {
    const order = { userId: '123', products: [{ productId: '456' }] };
    findOneOrderStub.resolves(order);

    const review = {
      userId: '123',
      productId: '456',
      rating: 4,
      feedback: 'Great product!',
    };
    createReviewStub.resolves(review);

    const res = await request(app)
      .post('/addreview/123')
      .send({ productId: '456', rating: 4, feedback: 'Great product!' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Review created successfully');
    expect(res.body.review).toEqual(review);
  });

  it('should return 500 if there is an internal server error', async () => {
    findOneOrderStub.rejects(new Error('Internal server error'));

    const res = await request(app)
      .post('/addreview/123')
      .send({ productId: '456', rating: 4, feedback: 'Great product!' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('addFeedback', () => {
  let createStub: sinon.SinonStub;

  beforeAll(() => {
    createStub = sinon.stub(Rating, 'create');
  });

  afterAll((done) => {
    createStub.restore();
    done()
  });

  it('should return 402 if name is not provided', async () => {
    const res = await request(app)
      .post('/addfeedback/123') 
      .send({ ratingScore: 4, feedback: 'Great product!' });

    expect(res.status).toBe(402);
    expect(res.body.message).toBe('You must add your name');
  });

  it('should return 402 if ratingScore is greater than 5', async () => {
    const res = await request(app)
      .post('/addfeedback/123')
      .send({ name: 'John Doe', ratingScore: 6, feedback: 'Great product!' });

    expect(res.status).toBe(402);
    expect(res.body.message).toBe('enter rating between 0 and 5');
  });

  it('should return 400 if saving data fails', async () => {
    createStub.resolves(null); 

    const res = await request(app)
      .post('/addfeedback/123')
      .send({ name: 'John Doe', ratingScore: 4, feedback: 'Great product!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('error in saving data');
  });

  it('should return 201 and save data successfully', async () => {
    const feedbackData = {
      name: 'John Doe',
      ratingScore: 4,
      feedback: 'Great product!',
      productId: '123',
    };
    createStub.resolves(feedbackData); 

    const res = await request(app)
      .post('/addfeedback/123')
      .send({ name: 'John Doe', ratingScore: 4, feedback: 'Great product!' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('feedback created');
    expect(res.body.data).toEqual(feedbackData);
  });

  it('should return 500 if there is an internal server error', async () => {
    createStub.rejects(new Error('Internal server error')); 

    const res = await request(app)
      .post('/addfeedback/123')
      .send({ name: 'John Doe', ratingScore: 4, feedback: 'Great product!' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('selectReview', () => {
  let findAllReviewStub: sinon.SinonStub;

  beforeAll(() => {
    findAllReviewStub = sinon.stub(Review, 'findAll');
  });

  afterAll((done) => {
    findAllReviewStub.restore();
    done()
  });

  it('should return 400 if no reviews are found', async () => {
    findAllReviewStub.resolves([]);

    const res = await request(app)
      .get('/select-review/123');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('There in no review in your products');
  });

  it('should return 200 and reviews if they exist', async () => {
    const reviews = [
      {
        id: 1,
        content: 'Great product!',
        Product: {
          vendorId: '123',
          name: 'Product1',
        },
      },
    ];
    findAllReviewStub.resolves(reviews);

    const res = await request(app)
      .get('/select-review/123'); // Adjust the URL as needed

    expect(res.status).toBe(200);
    expect(res.body.review).toEqual(reviews);
  });

  it('should return 500 if there is an internal server error', async () => {
    findAllReviewStub.rejects(new Error('Internal server error'));

    const res = await request(app)
      .get('/select-review/123');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});




