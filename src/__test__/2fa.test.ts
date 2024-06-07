import request from "supertest";
import sinon from "sinon";
import User from "../database/models/user";
import { Request, Response } from "express";
import { app, server } from "..";
import { twoFAController } from "../middleware/2fa.middleware";
import { verifyCode } from "../middleware/2fa.middleware";
import * as twoFAservice from "../services/2fa.service";
import { Session, Cookie } from "express-session";

beforeAll(() => {
  server;
});

describe("2FA Routes", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYnV5ZXIiLCJlbWFpbCI6Im1hcmtAZ21haWwuY29tIiwiaWQiOiJkMTlkN2I3Ny02ZjlhLTQwMmItODE2NC0zZjYxNjhjNmYwOGQiLCJwYXNzd29yZCI6IiQyYiQxMCR0eEY3UVhMSHdnY2FMelNieW94VTVPbHlaUGNjZC4uUndnTjVCY2N1Sy95Ty80MHI0Ty9oUyIsImlhdCI6MTcxNzY5MTk2NSwiZXhwIjoxNzE3Nzc4MzY1fQ.KzhRQGgq-cTGQAXllq_NgSNGHengFyCbsvw-3wD5zPs";
  let saveStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });

  describe("Enable 2FA", () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = {
        userId: "1",
        isTwoFactorEnabled: false,
        save: async function () {
          return this;
        },
      } as unknown as User;

      saveStub = sinon.stub(mockUser, "save").resolves(mockUser);
      findByPkStub = sinon.stub(User, "findByPk").resolves(mockUser);
    });

    it("should return status 200", async () => {
      const res = await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("should return correct message", async () => {
      const res = await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.message).toBe("2FA enabled.");
    });

    it("should call save method", async () => {
      await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(saveStub.called).toBe(true);
    });
  });

  describe("Disable 2FA", () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = {
        userId: "1",
        isTwoFactorEnabled: true,
        save: async function () {
          return this;
        },
      } as unknown as User;

      saveStub = sinon.stub(mockUser, "save").resolves(mockUser);
      findByPkStub = sinon.stub(User, "findByPk").resolves(mockUser);
    });

    it("should return status 200", async () => {
      const res = await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("should return correct message", async () => {
      const res = await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.message).toBe("2FA disabled.");
    });

    it("should call save method", async () => {
      await request(app)
        .post("/enable-2fa")
        .set("Authorization", `Bearer ${token}`);

      expect(saveStub.called).toBe(true);
    });
  });
});

interface ExtendedSession extends Session {
  twoFactorCode?: string | null;
  twoFactorExpiry?: Date;
  twoFAError?: string;
  email?: string;
  password?: string;
}

describe("twoFAController", () => {
  let req: Partial<Request> & { session?: ExtendedSession };
  let res: Partial<Response>;
  let next: jest.Mock;
  let userStub: sinon.SinonStub;
  let generate2FACodeStub: sinon.SinonStub;
  const twoFactorCode = "123456";
  const twoFactorExpiry = Date.now() + 120000;

  beforeEach(() => {
    req = {
      body: { email: "test@example.com", password: "password" },
      session: {
        id: "mockId",
        cookie: { originalMaxAge: 60000 } as Cookie,
        regenerate: jest.fn(),
        destroy: jest.fn(),
        reload: jest.fn(),
        resetMaxAge: jest.fn(),
        save: jest.fn(),
        touch: jest.fn(),
        twoFactorCode: "",
        twoFactorExpiry: new Date(),
        email: "",
        password: "",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    userStub = sinon.stub(User, "findOne");
    generate2FACodeStub = sinon.stub(twoFAservice, "generate2FACode");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should resolve generate2FACodeStub with a 2FA code and expiry", async () => {
    generate2FACodeStub.resolves({ twoFactorCode, twoFactorExpiry });
    await twoFAController(req as Request, res as Response, next);
    expect(generate2FACodeStub.calledOnce).toBeTruthy();
    expect(req.session?.twoFactorCode).toEqual(twoFactorCode);
    expect(req.session?.twoFactorExpiry?.getTime()).toEqual(twoFactorExpiry);
  });

  it("should call res.status with 200 and res.json with a success message", async () => {
    generate2FACodeStub.resolves({ twoFactorCode, twoFactorExpiry });
    await twoFAController(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "2FA code sent. Please verify the code.",
    });
  });

  it("should call next if 2FA is not enabled", async () => {
    userStub.resolves({ isTwoFactorEnabled: false });
    await twoFAController(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});

describe("verifyCode", () => {
  let req: Partial<Request> & { session?: ExtendedSession };
  let res: Partial<Response>;
  let next: jest.Mock;
  let sessionSaveStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: { code: "123456" },
      session: {
        twoFactorCode: "123456",
        twoFactorExpiry: new Date(Date.now() + 120000),
        save: function (callback?: (err: any) => void) {
          callback?.(null);
        },
      } as ExtendedSession,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    sessionSaveStub = sinon.stub(req.session as Session, "save");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should verify 2FA code and call next", async () => {
    sessionSaveStub.yields(null);

    await verifyCode(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    if (req.session) {
      expect(req.session.twoFactorCode).toBeNull();
      expect(req.session.twoFactorExpiry).toBeNull();
    }
  });

  it("should return error if 2FA code is invalid or expired", async () => {
    req.body.code = "111111";
    if (req.session) {
      req.session.twoFactorCode = "123456";
    }

    sessionSaveStub.yields(null);

    await verifyCode(req as Request, res as Response, next);
    if (req.session) {
      expect(req.session.twoFAError).toEqual("Invalid code.");
    }
  });

  it("should return error if saving session fails", async () => {
    sessionSaveStub.yields(new Error("Error saving session"));

    await verifyCode(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error saving session" });
  });
});

afterAll(() => {
  server.close();
});
