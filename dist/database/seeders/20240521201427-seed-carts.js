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
            console.log('Getting the users');
            const [users] = yield queryInterface.sequelize.query(`SELECT "userId" FROM "Users"`);
            users.map(user => (console.log('The users ', user)));
            const carts = users.map(user => ({
                cartId: uuidv4(),
                // @ts-ignore
                userId: user.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            yield queryInterface.bulkInsert('Carts', carts, {});
            for (const cart of carts) {
                yield queryInterface.bulkUpdate('Users', { cartId: cart.cartId }, { userId: cart.userId });
            }
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Carts', null, {});
            yield queryInterface.bulkUpdate('Users', { cartId: null }, { cartId: { [Sequelize.Op.ne]: null } });
        });
    }
};
