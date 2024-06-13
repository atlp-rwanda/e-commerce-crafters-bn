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
const expiring_1 = require("../helpers/expiring");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
describe("Check Expiring Products", () => {
    test("Should return No Expiring Product  ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiringProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 204) {
            expect(data).toEqual({ message: "No Expiring Products" });
        }
    }), 10000);
    test("Should return Check Expiring Product Successfully ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiringProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 200) {
            expect(data).toEqual({ message: "Check Expiring Product Successfully" });
        }
    }), 10000);
    test("Should return The error if Any", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiringProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 500) {
            expect(data).toEqual({ error: data.error });
        }
    }), 10000);
});
describe("Check Expired Products", () => {
    test("Should return No Expired Products To Update ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiredProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 204) {
            expect(data).toEqual({ message: "No Expired Products To Update" });
        }
    }), 10000);
    test("Should return Check Expired Product Successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiredProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 200) {
            expect(data).toEqual({
                message: "Check Expired Product Successfully And Sent Emails",
            });
        }
    }), 10000);
    test("If Any Error Should Return It", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = node_mocks_http_1.default.createResponse();
        yield (0, expiring_1.checkExpiredProducts)(undefined, res);
        const statusCode = res.statusCode;
        const data = res._getJSONData();
        if (statusCode === 500) {
            expect(data).toEqual({ error: data.error });
        }
    }), 10000);
});
