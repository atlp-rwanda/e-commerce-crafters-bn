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
const passport_1 = __importDefault(require("passport"));
const __1 = require("..");
const googleAuthService = __importStar(require("../services/googleAuth.service"));
beforeAll(() => {
    __1.server;
});
describe("Google Authentication Routes", () => {
    it("should return status 302 of redirection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get("/auth/google").send();
        expect(res.status).toBe(302);
    }));
    it("should redirect to Google for authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get("/auth/google").send();
        expect(res.headers.location.startsWith("https://accounts.google.com/o/oauth2/v2/auth")).toBeTruthy();
    }));
});
let findUserByEmailStub;
beforeEach(() => {
    findUserByEmailStub = sinon_1.default.stub(googleAuthService, "findUserByEmail");
    findUserByEmailStub.callsFake((email) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    name: "Test User",
                    email: email,
                    password: "hashedPassword",
                });
            }, 1000);
        });
    });
});
afterEach(() => {
    findUserByEmailStub.restore();
});
const passportMock = sinon_1.default.mock(passport_1.default);
passportMock.expects("authenticate").callsFake((strategy, options) => {
    if (strategy === "google") {
        return (req, res, next) => {
            const callback = options;
            if (req.query.error) {
                callback(new Error("Authentication failed"), null, {
                    message: "Authentication failed",
                })(req, res, next);
            }
            else {
                callback(null, { id: "testUser" }, null)(req, res, next);
            }
        };
    }
});
passportMock.expects("serializeUser").callsFake((user, done) => {
    if (typeof done === "function") {
        done(null, user);
    }
});
passportMock.expects("deserializeUser").callsFake((user, done) => {
    if (typeof done === "function") {
        done(null, user);
    }
});
passportMock.expects("use").returnsThis();
passportMock
    .expects("initialize")
    .returns((req, res, next) => next());
passportMock
    .expects("session")
    .returns((req, res, next) => next());
describe("Handle Google callback", () => {
    let res;
    afterEach(() => {
        sinon_1.default.restore();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        res = yield (0, supertest_1.default)(__1.app).get("/auth/google/callback").send();
    }));
    it("should return status 200", () => {
        expect(res.status).toBe(200);
    });
    it("should have a message property in the response body", () => {
        expect(res.body).toHaveProperty("message");
    });
});
afterAll(() => {
    __1.server.close();
});
