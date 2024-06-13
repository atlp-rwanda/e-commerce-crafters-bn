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
            const profileUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXhCG6nff2emBYOKGHb6jU2zQ4C2m0LBg4Mj-eydwZyg&s';
            yield queryInterface.bulkInsert('Users', [
                {
                    userId: uuidv4(),
                    name: 'User1',
                    email: 'user1@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: uuidv4(),
                    name: 'User2',
                    email: 'user2@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    userId: uuidv4(),
                    name: 'User3',
                    email: 'user3@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: uuidv4(),
                    name: 'User4',
                    email: 'user4@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: uuidv4(),
                    name: 'User5',
                    email: 'user5@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    userId: uuidv4(),
                    name: 'User6',
                    email: 'user6@email.com',
                    password: 'password1',
                    status: 'active',
                    wishlistId: null,
                    cartId: null,
                    role: 'buyer',
                    profile: profileUrl,
                    isTwoFactorEnabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], {});
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete('Users', null, {});
        });
    }
};
