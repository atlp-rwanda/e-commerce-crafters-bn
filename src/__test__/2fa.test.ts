import request from "supertest";
import sinon from "sinon";
import User from "../database/models/user";
import { Request, Response } from "express";
import { app, server } from "..";
import { twoFAController } from "../middleware/2fa.middleware";
import { verifyCode } from "../middleware/2fa.middleware";
import * as twoFAservice from "../services/2fa.service";
import { Session, Cookie } from "express-session";
import * as verifyToken from "../middleware/verfiyToken";
import { generateToken } from "../helpers/generateToken";

beforeAll(() => {
  server;
});

describe("2FA Routes", () => {
  let token: string;
  let saveStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let checkTokenStub: sinon.SinonStub;

  afterEach(() => {
    findByPkStub.restore();
    checkTokenStub.restore();
    sinon.restore();
  });

  const test2FA = (enable: boolean) => {
    let mockUser: User;
    const status = enable ? "enabled" : "disabled";
    const route = `/enable-2fa`;

    beforeEach(async () => {
      mockUser = {
        userId: "1",
        isTwoFactorEnabled: !enable,
        save: async function () {
          return this;
        },
      } as unknown as User;

      token = await generateToken(mockUser);

      saveStub = sinon.stub(mockUser, "save").resolves(mockUser);
      findByPkStub = sinon.stub(User, "findByPk").resolves(mockUser);
      checkTokenStub = sinon.stub(verifyToken, "VerifyAccessToken").yields();
    });

    it("should return status 200", async () => {
      const res = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it(`should return correct message`, async () => {
      const res = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.message).toBe(`2FA ${status}.`);
    });

    it("should call save method", async () => {
      await request(app).post(route).set("Authorization", `Bearer ${token}`);

      expect(saveStub.called).toBe(true);
    });
  };

  describe("Enable 2FA", () => {
    test2FA(true);
  });

  describe("Disable 2FA", () => {
    test2FA(false);
  });
});

interface ExtendedSession extends Session {
  twoFactorCode?: string | null;
  twoFactorExpiry?: Date;
  twoFAError?: string;
  email?: string;
  password?: string;
}

function setup() {
  const req: Partial<Request> & { session?: ExtendedSession } = {
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
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  return { req, res, next };
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
    const setupResult = setup();
    req = setupResult.req;
    res = setupResult.res;
    next = setupResult.next;

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

  const testVerifyCode = async () => {
    sessionSaveStub.yields(null);
    await verifyCode(req as Request, res as Response, next);
  };

  it("should verify 2FA code and call next", async () => {
    await testVerifyCode();
    expect(next).toHaveBeenCalled();
    if (req.session) {
      expect(req.session.twoFactorCode).toBeNull();
      expect(req.session.twoFactorExpiry).toBeNull();
    }
  });

  it("should return error if 2FA code is invalid", async () => {
    req.body.code = "111111";
    if (req.session) {
      req.session.twoFactorCode = "123456";
    }
    await testVerifyCode();
    if (req.session) {
      expect(req.session.twoFAError).toEqual("Invalid code.");
    }
  });

  it("should return error if 2FA code has expired", async () => {
    if (req.session) {
      req.session.twoFactorExpiry = new Date(Date.now() - 120000);
    }
    await testVerifyCode();
    if (req.session) {
      expect(req.session.twoFAError).toEqual("The code has expired.");
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
