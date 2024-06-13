"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const user_1 = __importDefault(require("../database/models/user"));
const __1 = require("..");
const _2fa_middleware_1 = require("../middleware/2fa.middleware");
const _2fa_middleware_2 = require("../middleware/2fa.middleware");
const twoFAservice = __importStar(require("../services/2fa.service"));
const verifyToken = __importStar(require("../middleware/verfiyToken"));
const generateToken_1 = require("../helpers/generateToken");
beforeAll(() => {
    __1.server;
});
describe("2FA Routes", () => {
    let token;
    let saveStub;
    let findByPkStub;
    let checkTokenStub;
    afterEach(() => {
        findByPkStub.restore();
        checkTokenStub.restore();
        sinon_1.default.restore();
    });
    const test2FA = (enable) => {
        let mockUser;
        const status = enable ? "enabled" : "disabled";
        const route = `/enable-2fa`;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            mockUser = {
                userId: "1",
                isTwoFactorEnabled: !enable,
                save: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return this;
                    });
                },
            };
            token = yield (0, generateToken_1.generateToken)(mockUser);
            saveStub = sinon_1.default.stub(mockUser, "save").resolves(mockUser);
            findByPkStub = sinon_1.default.stub(user_1.default, "findByPk").resolves(mockUser);
            checkTokenStub = sinon_1.default.stub(verifyToken, "VerifyAccessToken").yields();
        }));
        it("should return status 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app)
                .post(route)
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(200);
        }));
        it(`should return correct message`, () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app)
                .post(route)
                .set("Authorization", `Bearer ${token}`);
            expect(res.body.message).toBe(`2FA ${status}.`);
        }));
        it("should call save method", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(__1.app).post(route).set("Authorization", `Bearer ${token}`);
            expect(saveStub.called).toBe(true);
        }));
    };
    describe("Enable 2FA", () => {
        test2FA(true);
    });
    describe("Disable 2FA", () => {
        test2FA(false);
    });
});
function setup() {
    const req = {
        body: { email: "test@example.com", password: "password" },
        session: {
            id: "mockId",
            cookie: { originalMaxAge: 60000 },
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
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const next = jest.fn();
    return { req, res, next };
}
describe("twoFAController", () => {
    let req;
    let res;
    let next;
    let userStub;
    let generate2FACodeStub;
    const twoFactorCode = "123456";
    const twoFactorExpiry = Date.now() + 120000;
    beforeEach(() => {
        const setupResult = setup();
        req = setupResult.req;
        res = setupResult.res;
        next = setupResult.next;
        userStub = sinon_1.default.stub(user_1.default, "findOne");
        generate2FACodeStub = sinon_1.default.stub(twoFAservice, "generate2FACode");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should resolve generate2FACodeStub with a 2FA code and expiry", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        generate2FACodeStub.resolves({ twoFactorCode, twoFactorExpiry });
        yield (0, _2fa_middleware_1.twoFAController)(req, res, next);
        expect(generate2FACodeStub.calledOnce).toBeTruthy();
        expect((_a = req.session) === null || _a === void 0 ? void 0 : _a.twoFactorCode).toEqual(twoFactorCode);
        expect((_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.twoFactorExpiry) === null || _c === void 0 ? void 0 : _c.getTime()).toEqual(twoFactorExpiry);
    }));
    it("should call res.status with 200 and res.json with a success message", () => __awaiter(void 0, void 0, void 0, function* () {
        generate2FACodeStub.resolves({ twoFactorCode, twoFactorExpiry });
        yield (0, _2fa_middleware_1.twoFAController)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "2FA code sent. Please verify the code.",
        });
    }));
    it("should call next if 2FA is not enabled", () => __awaiter(void 0, void 0, void 0, function* () {
        userStub.resolves({ isTwoFactorEnabled: false });
        yield (0, _2fa_middleware_1.twoFAController)(req, res, next);
        expect(next).toHaveBeenCalled();
    }));
});
describe("verifyCode", () => {
    let req;
    let res;
    let next;
    let sessionSaveStub;
    beforeEach(() => {
        req = {
            body: { code: "123456" },
            session: {
                twoFactorCode: "123456",
                twoFactorExpiry: new Date(Date.now() + 120000),
                save: function (callback) {
                    callback === null || callback === void 0 ? void 0 : callback(null);
                },
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        sessionSaveStub = sinon_1.default.stub(req.session, "save");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    const testVerifyCode = () => __awaiter(void 0, void 0, void 0, function* () {
        sessionSaveStub.yields(null);
        yield (0, _2fa_middleware_2.verifyCode)(req, res, next);
    });
    it("should verify 2FA code and call next", () => __awaiter(void 0, void 0, void 0, function* () {
        yield testVerifyCode();
        expect(next).toHaveBeenCalled();
        if (req.session) {
            expect(req.session.twoFactorCode).toBeNull();
            expect(req.session.twoFactorExpiry).toBeNull();
        }
    }));
    it("should return error if 2FA code is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body.code = "111111";
        if (req.session) {
            req.session.twoFactorCode = "123456";
        }
        yield testVerifyCode();
        if (req.session) {
            expect(req.session.twoFAError).toEqual("Invalid code.");
        }
    }));
    it("should return error if 2FA code has expired", () => __awaiter(void 0, void 0, void 0, function* () {
        if (req.session) {
            req.session.twoFactorExpiry = new Date(Date.now() - 120000);
        }
        yield testVerifyCode();
        if (req.session) {
            expect(req.session.twoFAError).toEqual("The code has expired.");
        }
    }));
    it("should return error if saving session fails", () => __awaiter(void 0, void 0, void 0, function* () {
        sessionSaveStub.yields(new Error("Error saving session"));
        yield (0, _2fa_middleware_2.verifyCode)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error saving session" });
    }));
});
afterAll(() => {
    __1.server.close();
});
