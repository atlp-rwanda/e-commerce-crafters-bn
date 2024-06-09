// import request from "supertest";
// import { app, server } from "..";

// describe("Welcome endpoint", () => {
//   beforeAll((done) => {
//     done();
//   });

//   afterAll((done) => {
//     server.close(done);
//   });
//   it("should return welcome message and status 200 ", async () => {
//     const response = await request(app).get("/");
//     expect(response.status).toBe(200);
//     expect(response.text).toContain(
//       "<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>"
//     );
//   });
// });

import { Request, Response } from "express";
import { deleteUser } from "../controllers/user.controller";
import { deleteUserById } from "../services/userService";
import User from "../database/models/user";

jest.mock("../services/userService");
jest.mock("../database/models/user");

const mockDeleteUserById = deleteUserById as jest.MockedFunction<
  typeof deleteUserById
>;
const mockFindByPk = User.findByPk as jest.MockedFunction<typeof User.findByPk>;

describe("deleteUser", () => {
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

  it("should delete  user and return a success message", async () => {
    mockFindByPk.mockResolvedValue({
      destroy: jest.fn().mockResolvedValueOnce(true),
    } as any);

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "User deleted successful" });
  });

  it("should return status 500 error if an exception occurs", async () => {
    mockDeleteUserById.mockRejectedValueOnce(
      new Error("Internal server error")
    );

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("should return  status 404  if user is not found", async () => {
    mockDeleteUserById.mockImplementationOnce(() => {
      throw new Error("user not found");
    });

    await deleteUser(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
