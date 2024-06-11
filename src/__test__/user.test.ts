import request from "supertest";
import { app, server } from "..";

beforeAll(() => {

});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

describe("Welcome endpoint", () => {

  it("should return welcome message and status 200 ", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain(
      "<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>"
    );
  });
});
