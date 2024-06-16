import { Request, Response } from "express";
import Order from "../database/models/order";
import { findVendorByUserId } from "../services/orderStatus";
import Product from "../database/models/product";
import { modifyOrderStatus } from "../controllers/orderController";

jest.mock("../services/orderStatus");
jest.mock("../database/models/order");
jest.mock("../database/models/product");

describe("modifyOrderStatus", () => {
  let req: Partial<Request> & { token: { id: string } };
  let res: Partial<Response>;
  let jsonSpy: jest.SpyInstance;
  let statusSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {
      params: { orderId: "1" },
      body: { status: "Shipped" },
      token: { id: "user1" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jsonSpy = jest.spyOn(res, "json");
    statusSpy = jest.spyOn(res, "status");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if no vendor is found", async () => {
    (findVendorByUserId as jest.Mock).mockResolvedValue(null);

    await modifyOrderStatus(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({ message: "No vendor found" });
  });

  it("should return 400 if invalid status is provided", async () => {
    req.body.status = "InvalidStatus";
    (findVendorByUserId as jest.Mock).mockResolvedValue({
      vendorId: "vendor1",
    });

    await modifyOrderStatus(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({ error: "Invalid order status" });
  });

  it("should return 404 if order is not found", async () => {
    (findVendorByUserId as jest.Mock).mockResolvedValue({
      vendorId: "vendor1",
    });
    (Order.findByPk as jest.Mock).mockResolvedValue(null);

    await modifyOrderStatus(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({ error: "Order not found" });
  });

  it("should return status 200 and update the order status", async () => {
    const mockOrder = {
      orderId: "1",
      status: "Pending",
      products: [{ productId: "product1", status: "Pending" }],
    };

    const mockVendor = { vendorId: "vendor1" };

    (findVendorByUserId as jest.Mock).mockResolvedValue(mockVendor);
    (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);
    (Product.findOne as jest.Mock).mockResolvedValue(true);
    (Order.update as jest.Mock).mockResolvedValue([1]);

    await modifyOrderStatus(req as Request, res as Response);

    expect(Order.update).toHaveBeenCalledWith(
      { products: mockOrder.products },
      { where: { orderId: mockOrder.orderId } }
    );

    expect(Order.update).toHaveBeenCalledWith(
      { status: "Pending" },
      { where: { orderId: mockOrder.orderId } }
    );

    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({
      message: `Order has been shipped`,
      order: mockOrder,
    });
  });

  it("should return status 500 if an internal server error occurs", async () => {
    const errorMessage = "Database error";
    (findVendorByUserId as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await modifyOrderStatus(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({ error: errorMessage });
  });
});
