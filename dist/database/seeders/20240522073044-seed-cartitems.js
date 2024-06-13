'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            const [carts] = yield queryInterface.sequelize.query(`
      SELECT "cartId"
      FROM "Carts"
      ORDER BY "createdAt" DESC
      LIMIT 3;
    `);
            const [products] = yield queryInterface.sequelize.query(`
      SELECT "productId", "price"
      FROM "Products"
      LIMIT 3;
    `);
            const quantity = 10;
            const cartItems = carts.flatMap(cart => products.map(product => ({
                cartitemsid: uuidv4(),
                // @ts-ignore
                cartId: cart.cartId,
                // @ts-ignore
                productId: product.productId,
                quantity: quantity,
                // @ts-ignore
                price: product.price * quantity,
                createdAt: new Date(),
                updatedAt: new Date()
            })));
            yield queryInterface.bulkInsert('CartItems', cartItems, {});
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('CartItems', null, {});
        });
    }
};
