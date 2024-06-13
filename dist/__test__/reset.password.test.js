"use strict";
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
const index_1 = require("../index");
const user_1 = __importDefault(require("../database/models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let sendMailStub;
beforeAll((done) => {
    sendMailStub = sinon_1.default
        .stub(nodemailer_1.default.createTransport({}).constructor.prototype, "sendMail")
        .resolves();
    done();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => index_1.server.close(resolve));
}));
describe("Password Reset API", () => {
    let findOneUserStub;
    let updateUserStub;
    beforeAll(() => {
        findOneUserStub = sinon_1.default.stub(user_1.default, "findOne");
        updateUserStub = sinon_1.default.stub(user_1.default.prototype, "save");
    });
    afterAll((done) => {
        findOneUserStub.restore();
        updateUserStub.restore();
        done();
    });
    describe("Request Password Reset", () => {
        it("should send a password reset email successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                userId: "user1",
                email: "user@example.com",
                name: "User",
                save: jest.fn(),
            };
            findOneUserStub.resolves(user);
            updateUserStub.resolves(user);
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/request-reset-password")
                .send({ email: "user@example.com" });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Password reset email sent");
            expect(sendMailStub.calledOnce).toBe(true);
        }));
        it("should return 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            findOneUserStub.resolves(null);
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/request-reset-password")
                .send({ email: "user@example.com" });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        }));
        it("should handle errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            findOneUserStub.rejects(new Error("Internal server error"));
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/request-reset-password")
                .send({ email: "user@example.com" });
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Error requesting password reset");
        }));
    });
    describe("Reset Password", () => {
        it("should reset the password successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                userId: "user1",
                resetPasswordToken: "reset-token",
                save: jest.fn(),
            };
            findOneUserStub.resolves(user);
            updateUserStub.resolves(user);
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/reset-password/reset-token")
                .send({ password: "newpassword123" });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Password has been reset");
        }));
        it("should return 400 if token is invalid or expired", () => __awaiter(void 0, void 0, void 0, function* () {
            findOneUserStub.resolves(null);
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/reset-password/reset-token")
                .send({ password: "newpassword123" });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Password reset token is invalid or has expired");
        }));
        it("should handle errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            findOneUserStub.rejects(new Error("Internal server error"));
            const res = yield (0, supertest_1.default)(index_1.app)
                .post("/reset-password/reset-token")
                .send({ password: "newpassword123" });
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Error resetting password");
        }));
    });
});
