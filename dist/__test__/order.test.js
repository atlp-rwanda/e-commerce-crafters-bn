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
const order_1 = __importDefault(require("../database/models/order"));
const orderController_1 = require("../controllers/orderController");
const sinon_1 = __importDefault(require("sinon"));
describe("modifyOrderStatus", () => {
    let req;
    let res;
    let json;
    let status;
    let findByPkStub;
    let consoleErrorMock;
    beforeEach(() => {
        req = {
            params: { orderId: "1" },
            body: { status: "Shipped" },
            token: { userId: "1" },
        };
        json = sinon_1.default.spy();
        status = sinon_1.default.stub().returns({ json });
        res = { status };
        findByPkStub = sinon_1.default.stub(order_1.default, "findByPk");
        consoleErrorMock = sinon_1.default.stub(console, "error").callsFake(() => { });
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return status 400 for invalid order status", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body.status = "InvalidStatus";
        yield (0, orderController_1.modifyOrderStatus)(req, res);
        sinon_1.default.assert.calledWith(status, 400);
        sinon_1.default.assert.calledWith(json, { error: "Invalid order status" });
    }));
    it("should return status 404 if order is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.resolves(null);
        yield (0, orderController_1.modifyOrderStatus)(req, res);
        sinon_1.default.assert.calledWith(status, 404);
        sinon_1.default.assert.calledWith(json, { error: "Order not found" });
    }));
    it("should return status 403 if user is not the owner of the order", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.resolves({ userId: "2", save: sinon_1.default.stub() });
        yield (0, orderController_1.modifyOrderStatus)(req, res);
        sinon_1.default.assert.calledWith(status, 403);
        sinon_1.default.assert.calledWith(json, {
            error: "Only the vendor can update the order status",
        });
    }));
    it("should return status 200 and update the order status", () => __awaiter(void 0, void 0, void 0, function* () {
        const save = sinon_1.default.stub();
        findByPkStub.resolves({
            userId: "1",
            status: "Pending",
            save,
        });
        yield (0, orderController_1.modifyOrderStatus)(req, res);
        sinon_1.default.assert.calledWith(status, 200);
        sinon_1.default.assert.calledWith(json, {
            message: "Order has been shipped",
            order: { userId: "1", status: "Shipped", save },
        });
        sinon_1.default.assert.calledOnce(save);
    }));
    it("should return status 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        findByPkStub.throws(new Error("Internal server error"));
        yield (0, orderController_1.modifyOrderStatus)(req, res);
        sinon_1.default.assert.calledWith(status, 500);
        sinon_1.default.assert.calledWith(json, { error: "Internal server error" });
    }));
});
