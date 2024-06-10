

import { Request, Response } from "express";
import Order from "../database/models/order";
import { modifyOrderStatus } from "../controllers/orderController";

jest.mock("../database/models/order");

interface CustomRequest extends Request {
  token: {
    userId: string;
  };
}

const mockFindByPk = Order.findByPk as jest.MockedFunction<
  typeof Order.findByPk
>;

describe("modifyOrderStatus", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    req = {
      params: { orderId: "1" },
      body: { status: "Shipped" },
      token: { userId: "1" },
    };
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = { status } as unknown as Response;

    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();


    consoleErrorMock.mockRestore();
  });

  it("should return status 400 for invalid order status", async () => {
    req.body.status = "InvalidStatus";

    await modifyOrderStatus(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "Invalid order status" });
  });

  it("should return status 404 if order is not found", async () => {
    mockFindByPk.mockResolvedValue(null);

    await modifyOrderStatus(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Order not found" });
  });

  it("should return status 403 if user is not the owner of the order", async () => {
    mockFindByPk.mockResolvedValue({ userId: "2", save: jest.fn() } as any);

    await modifyOrderStatus(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: "Only the vendor can update the order status",
    });
  });

  it("should return status 200 and update the order status", async () => {
    const save = jest.fn();
    mockFindByPk.mockResolvedValue({
      userId: "1",
      status: "Pending",
      save,
    } as any);

    await modifyOrderStatus(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      message: "Order has been shipped",
      order: { userId: "1", status: "Shipped", save },
    });
    expect(save).toHaveBeenCalled();
  });

  it("should return status 500 if an internal server error occurs", async () => {
    mockFindByPk.mockImplementation(() => {
      throw new Error("Internal server error");
    });

    await modifyOrderStatus(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
