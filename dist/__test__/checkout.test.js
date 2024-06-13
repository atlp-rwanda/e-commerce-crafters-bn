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
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_controller_1 = require("../controllers/checkout.controller");
jest.mock('../database/models/order');
jest.mock('../database/models/cart');
jest.mock('../database/models/cartitem');
describe('createOrder', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                userId: 'user123',
                deliveryAddress: '123 Main St',
                paymentMethod: 'credit_card',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 400 if userId, deliveryAddress, or paymentMethod is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.userId;
        yield (0, checkout_controller_1.createOrder)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    }));
});
