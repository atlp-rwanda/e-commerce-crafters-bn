import request from "supertest";
import sinon from "sinon";
import { app, server } from "../index";
import User from "../database/models/user";
import nodemailer from "nodemailer";
import crypto from "crypto";

let sendMailStub: sinon.SinonStub;

beforeAll((done) => {
  sendMailStub = sinon
    .stub(nodemailer.createTransport({}).constructor.prototype, "sendMail")
    .resolves();
  done();
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("Password Reset API", () => {
  let findOneUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;

  beforeAll(() => {
    findOneUserStub = sinon.stub(User, "findOne");
    updateUserStub = sinon.stub(User.prototype, "save");
  });

  afterAll((done) => {
    findOneUserStub.restore();
    updateUserStub.restore();
    done();
  });

  describe("Request Password Reset", () => {
    it("should send a password reset email successfully", async () => {
      const user = {
        userId: "user1",
        email: "user@example.com",
        name: "User",
        save: jest.fn(),
      };

      findOneUserStub.resolves(user);
      updateUserStub.resolves(user);

      const res = await request(app)
        .post("/request-reset-password")
        .send({ email: "user@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset email sent");
      expect(sendMailStub.calledOnce).toBe(true);
    });

    it("should return 404 if user is not found", async () => {
      findOneUserStub.resolves(null);

      const res = await request(app)
        .post("/request-reset-password")
        .send({ email: "user@example.com" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should handle errors gracefully", async () => {
      findOneUserStub.rejects(new Error("Internal server error"));

      const res = await request(app)
        .post("/request-reset-password")
        .send({ email: "user@example.com" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error requesting password reset");
    });
  });

  describe("Reset Password", () => {
    it("should reset the password successfully", async () => {
      const user = {
        userId: "user1",
        resetPasswordToken: "reset-token",
        save: jest.fn(),
      };

      findOneUserStub.resolves(user);
      updateUserStub.resolves(user);

      const res = await request(app)
        .post("/reset-password/reset-token")
        .send({ password: "newpassword123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password has been reset");
    });

    it("should return 400 if token is invalid or expired", async () => {
      findOneUserStub.resolves(null);

      const res = await request(app)
        .post("/reset-password/reset-token")
        .send({ password: "newpassword123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Password reset token is invalid or has expired"
      );
    });

    it("should handle errors gracefully", async () => {
      findOneUserStub.rejects(new Error("Internal server error"));

      const res = await request(app)
        .post("/reset-password/reset-token")
        .send({ password: "newpassword123" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error resetting password");
    });
  });
});
