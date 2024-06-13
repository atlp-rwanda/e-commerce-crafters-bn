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
            const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXhCG6nff2emBYOKGHb6jU2zQ4C2m0LBg4Mj-eydwZyg&s';
            const [vendors] = yield queryInterface.sequelize.query(`
      SELECT "vendorId" 
      FROM "Vendors" 
      ORDER BY "createdAt" DESC 
      LIMIT 3;
    `);
            const products = vendors.map(vendor => ({
                productId: uuidv4(),
                // @ts-ignore
                vendorId: vendor.vendorId,
                name: 'nike shoes',
                image: imageUrl,
                description: 'These are nike shoes.',
                discount: 2,
                price: 12000,
                quantity: 100,
                category: 'Shoes',
                createdAt: new Date(),
                updatedAt: new Date(),
                expired: false,
                available: true
            }));
            yield queryInterface.bulkInsert('Products', products, {});
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Products', null, {});
        });
    }
};
