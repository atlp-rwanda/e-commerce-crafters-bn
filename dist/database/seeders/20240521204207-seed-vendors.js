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
      ORDER BY "createdAt" DESC 
      LIMIT 3;
    `);
            const vendors = users.map(user => ({
                vendorId: uuidv4(),
                // @ts-ignore
                userId: user.userId,
                storeName: `Store ${Math.floor(Math.random() * (11))}`,
                address: JSON.stringify({
                    street: 'KG 111 ST',
                    city: 'Kigali'
                }),
                TIN: Math.floor(Math.random() * 100000000),
                bankAccount: Math.floor(Math.random() * 1000000000),
                paymentDetails: JSON.stringify({
                    method: 'Bank Transfer',
                    bankName: 'Bank Of Kigali'
                }),
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            yield queryInterface.bulkInsert('Vendors', vendors, {});
            yield queryInterface.bulkUpdate('Users', { role: 'vendor' }, 
            // @ts-ignore
            { userId: users.map(user => user.userId) });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Vendors', null, {});
            yield queryInterface.bulkUpdate('Users', { role: 'buyer' }, { role: 'vendor' });
        });
    }
};
