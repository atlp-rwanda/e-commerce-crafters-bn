import request from 'supertest';
import sinon from 'sinon';
import  {app}  from '../index'; 
import  Rating  from '../database/models/rating'; 
import Review from '../database/models/review';
import Order from '../database/models/order';



describe('addFeedback', () => {
  let createStub: sinon.SinonStub;

  beforeAll(() => {
    createStub = sinon.stub(Rating, 'create');
  });

  afterAll(() => {
    createStub.restore();
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






