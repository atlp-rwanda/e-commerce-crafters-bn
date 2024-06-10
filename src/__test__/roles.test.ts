import request from "supertest";
import sinon from "sinon";
import { app, server } from "../index";
import * as rolesService from "../services/rolesService";
import User from "../database/models/user";
import Vendor from "../database/models/vendor";
import nodemailer from "nodemailer";

beforeAll(() => {});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("Vendor Approval Endpoint", () => {
  let approveVendorRequestStub: sinon.SinonStub;
  let vendorFindOneStub: sinon.SinonStub;
  let userFindOneStub: sinon.SinonStub;
  let vendorUpdateStub: sinon.SinonStub;
  let userUpdateStub: sinon.SinonStub;
  let transporter: any;

  beforeEach(() => {
    approveVendorRequestStub = sinon.stub(rolesService, "approveVendorRequest");
    vendorFindOneStub = sinon.stub(Vendor, "findOne");
    userFindOneStub = sinon.stub(User, "findOne");
    vendorUpdateStub = sinon.stub(Vendor, "update");
    userUpdateStub = sinon.stub(User, "update");

    transporter = {
      sendMail: sinon.stub().resolves(),
    };
    sinon.stub(nodemailer, "createTransport").returns(transporter);
  });

  afterEach(() => {
    approveVendorRequestStub.restore();
    vendorFindOneStub.restore();
    userFindOneStub.restore();
    vendorUpdateStub.restore();
    userUpdateStub.restore();
    (nodemailer.createTransport as sinon.SinonStub).restore();
    sinon.restore();
  });

  it("should approve vendor request successfully", async () => {
    vendorFindOneStub.resolves({ userId: "123" });
    userFindOneStub.resolves({
      userId: "123",
      email: "test@example.com",
      name: "Test User",
    });
    vendorUpdateStub.resolves([1]);
    userUpdateStub.resolves([1]);

    approveVendorRequestStub.resolves({
      status: 200,
      message: "Vendor Request Approved",
    });

    const response = await request(app).put("/approve-vendor/123");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Vendor Request Approved");
  });

  it("should return 404 if vendor request is not found", async () => {
    vendorFindOneStub.resolves(null);

    approveVendorRequestStub.resolves({
      status: 404,
      message: "Vendor Request Not Found",
    });

    const response = await request(app).put("/approve-vendor/123");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vendor Request Not Found");
  });

  it("should return 500 if there is an internal server error", async () => {
    vendorFindOneStub.rejects(new Error("Internal server error"));

    approveVendorRequestStub.rejects(new Error("Internal server error"));

    const response = await request(app).put("/approve-vendor/123");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
