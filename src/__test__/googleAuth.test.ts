import request from "supertest";
import { Response as response } from "supertest";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { app, server } from "..";
import * as googleAuthService from "../services/googleAuth.service";

beforeAll(() => {
  server;
});

describe("Google Authentication Routes", () => {
  it("should return status 302 of redirection", async () => {
    const res = await request(app).get("/auth/google").send();

    expect(res.status).toBe(302);
  });

  it("should redirect to Google for authentication", async () => {
    const res = await request(app).get("/auth/google").send();

    expect(
      res.headers.location.startsWith(
        "https://accounts.google.com/o/oauth2/v2/auth"
      )
    ).toBeTruthy();
  });
});

let findUserByEmailStub: any;

beforeEach(() => {
  findUserByEmailStub = sinon.stub(googleAuthService, "findUserByEmail");
  findUserByEmailStub.callsFake((email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: "Test User",
          email: email,
          password: "hashedPassword",
        });
      }, 1000);
    });
  });
});

afterEach(() => {
  findUserByEmailStub.restore();
});

const passportMock = sinon.mock(passport);
passportMock.expects("authenticate").callsFake((strategy, options) => {
  if (strategy === "google") {
    return (req: Request, res: Response, next: NextFunction) => {
      const callback = options;
      if (req.query.error) {
        callback(new Error("Authentication failed"), null, {
          message: "Authentication failed",
        })(req, res, next);
      } else {
        callback(null, { id: "testUser" }, null)(req, res, next);
      }
    };
  }
});
passportMock.expects("serializeUser").callsFake((user, done) => {
  if (typeof done === "function") {
    done(null, user);
  }
});
passportMock.expects("deserializeUser").callsFake((user, done) => {
  if (typeof done === "function") {
    done(null, user);
  }
});
passportMock.expects("use").returnsThis();
passportMock
  .expects("initialize")
  .returns((req: Request, res: Response, next: NextFunction) => next());
passportMock
  .expects("session")
  .returns((req: Request, res: Response, next: NextFunction) => next());

describe("Handle Google callback", () => {
  let res: response;

  afterEach(() => {
    sinon.restore();
  });

  beforeAll(async () => {
    res = await request(app).get("/auth/google/callback").send();
  });

  it("should return status 200", () => {
    expect(res.status).toBe(200);
  });

  it("should have a message property in the response body", () => {
    expect(res.body).toHaveProperty("message");
  });
});

afterAll(() => {
  server.close();
});