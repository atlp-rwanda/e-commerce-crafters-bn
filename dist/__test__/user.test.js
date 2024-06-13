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
const user_controller_1 = require("../controllers/user.controller");
const user_1 = __importDefault(require("../database/models/user"));
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const index_1 = require("../index");
const nodemailer_1 = __importDefault(require("nodemailer"));
const passwordUtils = __importStar(require("../services/userService"));
jest.setTimeout(50000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => index_1.server.close(resolve));
}));
describe("deleteUser", () => {
    let req;
    let res;
    let json;
    let status;
    let findByPkStub;
    beforeEach(() => {
        req = { params: { id: "1" } };
        json = sinon_1.default.spy();
        status = sinon_1.default.stub().returns({ json });
        res = { status };
        findByPkStub = sinon_1.default.stub(user_1.default, "findByPk");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should delete user and return a success message", () => __awaiter(void 0, void 0, void 0, function* () {
        const destroyStub = sinon_1.default.stub().resolves(true);
        findByPkStub.resolves({
            destroy: destroyStub,
        });
        yield (0, user_controller_1.deleteUser)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledOnce(destroyStub);
        sinon_1.default.assert.calledWith(status, 200);
        sinon_1.default.assert.calledWith(json, { message: "User deleted successful" });
    }));
    it("should return status 500 error if an exception occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.rejects(new Error("Internal server error"));
        yield (0, user_controller_1.deleteUser)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledWith(status, 500);
        sinon_1.default.assert.calledWith(json, { error: "Internal server error" });
    }));
    it("should return status 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.resolves(null);
        yield (0, user_controller_1.deleteUser)(req, res);
        sinon_1.default.assert.calledOnce(findByPkStub);
        sinon_1.default.assert.calledWith(status, 404);
        sinon_1.default.assert.calledWith(json, { error: "User not found" });
    }));
});
describe("register", () => {
    let createStub;
    let findOneStub;
    let sendMailStub;
    let transportStub;
    beforeAll(() => {
        createStub = sinon_1.default.stub(user_1.default, "create");
        findOneStub = sinon_1.default.stub(user_1.default, "findOne");
        transportStub = {
            sendMail: sinon_1.default.stub().resolves(true),
        };
        sinon_1.default.stub(nodemailer_1.default, "createTransport").returns(transportStub);
    });
    afterAll(() => {
        createStub.restore();
        findOneStub.restore();
        nodemailer_1.default.createTransport.restore();
    });
    it("should return 400 if name, email, or password is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/register")
            .send({ email: "test@example.com", password: "password123" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Please fill all fields");
    }));
    it("should return 409 if email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneStub.resolves({ id: 1, email: "duplicate@example.com" });
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/register")
            .send({
            name: "John Doe",
            email: "duplicate@example.com",
            password: "password123",
        });
        expect(res.status).toBe(409);
        expect(res.body.Message).toBe("Email already exists");
    }));
    it("should return 201 and save user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            id: 1,
            name: "John Doe",
            email: "test@example.com",
            password: "hashedpassword",
        };
        findOneStub.resolves(null);
        createStub.resolves(newUser);
        transportStub.sendMail.resolves({ accepted: ["test@example.com"] });
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/register")
            .send({
            name: "John Doe",
            email: "test@example.com",
            password: "password123",
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User created");
        expect(res.body.user).toEqual(newUser);
        expect(res.body.email).toBe("Email sent to your email address");
    }));
    it("should return 500 if there is an internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
        createStub.rejects(new Error("Internal server error"));
        const res = yield (0, supertest_1.default)(index_1.app)
            .post("/register")
            .send({
            name: "John Doe",
            email: "test@example.com",
            password: "password123",
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error");
    }));
});
describe("PATCH /updateuser/", () => {
    let findOneUserStub;
    let updateUserStub;
    beforeEach(() => {
        findOneUserStub = sinon_1.default.stub(user_1.default, "findOne");
        updateUserStub = sinon_1.default.stub(user_1.default.prototype, "save");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub.resolves(null);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updateuser/1")
            .send({ name: "New Name" });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
    }));
    it("should return 403 if email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub
            .onFirstCall()
            .resolves({ userId: 1 })
            .onSecondCall()
            .resolves({ userId: 2 });
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updateuser/1")
            .send({ email: "existing@example.com" });
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message", "Email already exists");
    }));
    it("should update user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            userId: 1,
            save: jest.fn().mockResolvedValue({ userId: 1, name: "New Name" }),
        };
        findOneUserStub.resolves(mockUser);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updateuser/1")
            .send({ name: "New Name" });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User update success");
        expect(response.body).toHaveProperty("user", { userId: 1, name: "New Name" });
    }));
});
describe("PATCH /updatepassword/", () => {
    let findOneUserStub;
    let updateUserStub;
    let comparePasswordStub;
    let hashPasswordStub;
    beforeEach(() => {
        findOneUserStub = sinon_1.default.stub(user_1.default, "findOne");
        updateUserStub = sinon_1.default.stub(user_1.default.prototype, "save");
        comparePasswordStub = sinon_1.default.stub(passwordUtils, "comparePassword");
        hashPasswordStub = sinon_1.default.stub(passwordUtils, "hashPassword");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub.resolves(null);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updatepassword/1")
            .send({
            password: "oldPass",
            newPassword: "newPass",
            confirmPassword: "newPass",
        });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
    }));
    it("should return 400 if fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub.resolves({ userId: 1, password: "hashedOldPass" });
        comparePasswordStub.resolves(false);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updatepassword/1")
            .send({ password: "oldPass", newPassword: "newPass" });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please fill all fields");
    }));
    it("should return 400 if old password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub.resolves({ userId: 1, password: "hashedOldPass" });
        comparePasswordStub.resolves(false);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updatepassword/1")
            .send({
            password: "wrongOldPass",
            newPassword: "newPass",
            confirmPassword: "newPass",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Wrong password");
    }));
    it("should return 400 if new passwords do not match", () => __awaiter(void 0, void 0, void 0, function* () {
        findOneUserStub.resolves({ userId: 1, password: "hashedOldPass" });
        comparePasswordStub.resolves(true);
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updatepassword/1")
            .send({
            password: "oldPass",
            newPassword: "newPass",
            confirmPassword: "differentNewPass",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Passwords don't match");
    }));
    it("should update password successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            userId: 1,
            password: "hashedOldPass",
            save: jest.fn().mockResolvedValue({ userId: 1, password: "hashedNewPass" }),
        };
        findOneUserStub.resolves(mockUser);
        comparePasswordStub.resolves(true);
        hashPasswordStub.resolves("hashedNewPass");
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch("/updatepassword/1")
            .send({
            password: "oldPass",
            newPassword: "newPass",
            confirmPassword: "newPass",
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Password updated successfully");
        expect(response.body).toHaveProperty("user", {
            userId: 1,
            password: "hashedNewPass",
        });
    }));
});
describe("Welcome endpoint", () => {
    it("should return welcome message and status 200 ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toContain("<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>");
    }));
});
