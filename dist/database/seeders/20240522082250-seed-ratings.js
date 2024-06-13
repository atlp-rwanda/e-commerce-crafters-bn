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
            const [users] = yield queryInterface.sequelize.query(`
      SELECT "userId"
      FROM "Users"
      LIMIT 3;
    `);
            const [products] = yield queryInterface.sequelize.query(`
      SELECT "productId"
      FROM "Products"
      LIMIT 3;
    `);
            const ratings = users.flatMap(user => products.map(product => ({
                ratingId: uuidv4(),
                name: "peter",
                ratingScore: 5,
                feedback: "good product",
                // @ts-ignore
                productId: product.productId,
                // @ts-ignore
                createdAt: new Date(),
                updatedAt: new Date()
            })));
            yield queryInterface.bulkInsert('Ratings', ratings, {});
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Ratings', null, {});
        });
    }
};
