'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const profileUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXhCG6nff2emBYOKGHb6jU2zQ4C2m0LBg4Mj-eydwZyg&s'
    await queryInterface.bulkInsert('Users', [
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
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Users', null, {});
  }
};
