import request from "supertest";
import { app, server } from "..";

describe("Welcome endpoint", () => {
  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });
  it("should return welcome message and status 200 ", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain(
      "<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>"
    );
  });
});
