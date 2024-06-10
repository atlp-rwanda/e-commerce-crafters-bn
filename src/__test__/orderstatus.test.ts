import sinon from "sinon";
import request from "supertest";
import { app, server, ioServer } from "..";
import Order from "../database/models/order";
import User from "../database/models/user";
import { NextFunction, Request, Response } from "express";
import { verifyAdmin } from "../middleware/verifyRole";
import jwt from "jsonwebtoken";

function generateToken() {
  const payload = { userId: "test-user" };
  const secret = process.env.JWT_SECRET || "crafters1234";
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
}

jest.setTimeout(50000);
jest.mock("../middleware/verfiyToken", () => {
  return {
    VerifyAccessToken: (req: Request, res: Response, next: NextFunction) => {
      (req as any).token = { userId: "test-user" };
      next();
    },
  };
});

jest.mock("../middleware/verifyRole", () => {
  return {
    verifyAdmin: (req: Request, res: Response, next: NextFunction) => {
      (req as any).user = { role: "admin" };
      next();
    },
  };
});

describe("Order", () => {
  let findOneStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let emitStub: sinon.SinonStub;

  beforeAll(() => {});

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    findOneStub = sinon.stub(Order, "findOne");
    findByPkStub = sinon.stub(User, "findByPk");
    emitStub = sinon.stub(ioServer, "emit");
  });

  afterEach(() => {
    findOneStub.restore();
    findByPkStub.restore();
    emitStub.restore();
  });

  describe("getOrderStatus", () => {
    it("should return 404 if order not found", async () => {
    
      findByPkStub.resolves(null);

      const token = generateToken();

      const res = await request(app)
        .get("/order/1/status")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Order not found");
    });

    it("should return 200 if order is found", async () => {
      const order = {
        orderId: "1",
        status: "Processing",
        expectedDeliveryDate: "2024-12-31",
      };
      findOneStub.resolves(order);
      const token = generateToken();
      const res = await request(app)
        .get("/order/1/status")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        orderId: "1",
        status: "Processing",
        expectedDeliveryDate: "2024-12-31",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      findOneStub.rejects(new Error("Internal server error"));
        
      const token = generateToken();
      const res = await request(app)
        .get("/order/1/status")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Internal server error");
    });
  });

  describe("updateOrderStatus", () => {
    it("should return 400 if invalid status is sent", async () => {
      findByPkStub.resolves(null);

      const res = await request(app)
        .put("/order/1/status")
        .set("Authorization", "Bearer fake-token");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid order status");
    });

    it("should return 403 if user is not admin", async () => {
      findByPkStub.resolves({ role: "regular" });

      const res = await request(app)
        .put("/order/1/status")
        .set("Authorization", "Bearer fake-token")
        .send({ status: "processing" });
    });

    it("should return 404 if order not found", async () => {
      findByPkStub.resolves({ role: "admin" });
      findOneStub.resolves(null);

      const res = await request(app)
        .put("/order/1/status")
        .set("Authorization", "Bearer fake-token")
        .send({ userId: "1", status: "processing" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Order not found");
    });

    it("should return 200 if order is updated successfully", async () => {
      findByPkStub.resolves({ role: "admin" });
      const order = {
        orderId: "1",
        status: "processing",
        expectedDeliveryDate: new Date("2024-12-31"),
        save: sinon.stub().resolves(),
      };

      findOneStub.resolves(order);

      const res = await request(app)
        .put("/order/1/status")
        .send({ userId: "1", status: "shipped" })
        .set("Authorization", "Bearer fake-token");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        orderId: "1",
        status: "shipped",
        expectedDeliveryDate: "12/31/2024",
      });

      expect(emitStub.calledOnce).toBe(true);
    });

    it("should return 500 if there is an internal server error", async () => {
      findByPkStub.resolves({ role: "admin" });
      findOneStub.rejects(new Error("Internal server error"));

      const res = await request(app)
        .put("/order/1/status")
        .send({ userId: "1", status: "shipped" })
        .set("Authorization", "Bearer fake-token");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Internal server error");
    });
  });
});
