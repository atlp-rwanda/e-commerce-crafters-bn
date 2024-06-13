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
// @ts-ignore
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    // @ts-ignore
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users] = yield queryInterface.sequelize.query(`
      SELECT "userId"
      FROM "Users"
      ORDER BY "createdAt" DESC
      LIMIT 3;
    `);
            const [products] = yield queryInterface.sequelize.query(`
      SELECT "productId"
      FROM "Products"
      LIMIT 3;
    `);
            const wishlists = users.flatMap(user => products.map(product => ({
                wishlistId: uuidv4(),
                // @ts-ignore
                userId: user.userId,
                // @ts-ignore
                productId: product.productId,
                createdAt: new Date(),
                updatedAt: new Date()
            })));
            yield queryInterface.bulkInsert('Wishlists', wishlists, {});
            for (const wishlist of wishlists) {
                yield queryInterface.bulkUpdate('Users', { wishlistId: wishlist.wishlistId }, { userId: wishlist.userId });
            }
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Carts', null, {});
            yield queryInterface.bulkUpdate('Users', { wishlistId: null }, { wishlistId: { [Sequelize.Op.ne]: null } });
        });
    }
};
