import request from 'supertest';
import {app, closeServer, startServer} from '..'

beforeAll(async () => {
  console.log("test starting ..........");
  await startServer();
});

afterAll(async () => {
  await closeServer();
  console.log("server stop..........");
});

describe("Welcome endpoint",()=>{
    
    it('should return welcome message and status 200 ', async()=>{
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain("<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>");
     
    });
})