

import { Request, Response } from "express";
import Order from "../database/models/order";
import { modifyOrderStatus } from "../controllers/orderController";
import sinon from "sinon";

interface CustomRequest extends Request {
  token: {
    userId: string;
  };
}

describe("modifyOrderStatus", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let json: sinon.SinonSpy;
  let status: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let consoleErrorMock: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: { orderId: "1" },
      body: { status: "Shipped" },
      token: { userId: "1" },
    };
    json = sinon.spy();
    status = sinon.stub().returns({ json });
    res = { status } as unknown as Response;

    findByPkStub = sinon.stub(Order, "findByPk");

    consoleErrorMock = sinon.stub(console, "error").callsFake(() => {});
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return status 400 for invalid order status", async () => {
    req.body.status = "InvalidStatus";

    await modifyOrderStatus(req as Request, res as Response);

    sinon.assert.calledWith(status, 400);
    sinon.assert.calledWith(json, { error: "Invalid order status" });
  });

  it("should return status 404 if order is not found", async () => {
    findByPkStub.resolves(null);

    await modifyOrderStatus(req as Request, res as Response);

    sinon.assert.calledWith(status, 404);
    sinon.assert.calledWith(json, { error: "Order not found" });
  });

  it("should return status 403 if user is not the owner of the order", async () => {
    findByPkStub.resolves({ userId: "2", save: sinon.stub() } as any);

    await modifyOrderStatus(req as Request, res as Response);

    sinon.assert.calledWith(status, 403);
    sinon.assert.calledWith(json, {
      error: "Only the vendor can update the order status",
    });
  });

  it("should return status 200 and update the order status", async () => {
    const save = sinon.stub();
    findByPkStub.resolves({
      userId: "1",
      status: "Pending",
      save,
    } as any);

    await modifyOrderStatus(req as Request, res as Response);

    sinon.assert.calledWith(status, 200);
    sinon.assert.calledWith(json, {
      message: "Order has been shipped",
      order: { userId: "1", status: "Shipped", save },
    });
    sinon.assert.calledOnce(save);
  });

  it("should return status 500 if an internal server error occurs", async () => {
    findByPkStub.throws(new Error("Internal server error"));

    await modifyOrderStatus(req as Request, res as Response);

    sinon.assert.calledWith(status, 500);
    sinon.assert.calledWith(json, { error: "Internal server error" });
  });
});
