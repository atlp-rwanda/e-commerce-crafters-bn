
import { Request, Response } from "express";
import { deletingVendor } from "../controllers/vendor.controller";
import { deleteVendorById } from "../services/vendorServices";
import Vendor from "../database/models/vendor";

jest.mock("../services/vendorServices");
jest.mock("../database/models/vendor");

const mockDeleteVendorById = deleteVendorById as jest.MockedFunction<
  typeof deleteVendorById
>;
const mockFindByPk = Vendor.findByPk as jest.MockedFunction<
  typeof Vendor.findByPk
>;

describe("Vendor Deletion", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = { params: { id: "1" } };
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = { status } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 200 and success message if vendor is deleted", async () => {
    mockFindByPk.mockResolvedValue({
      destroy: jest.fn().mockResolvedValueOnce(true),
    } as any);

    await deletingVendor(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Vendor deleted successful" });
  });

  it("should return status 500 and error message if an exception occurs", async () => {
    mockDeleteVendorById.mockRejectedValueOnce(
      new Error("Internal server error")
    );

    await deletingVendor(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("should return status 404 and error message if vendor is not found", async () => {
    mockDeleteVendorById.mockImplementationOnce(() => {
      throw new Error("Vendor not found");
    });

    await deletingVendor(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Vendor not found" });

  });
});
