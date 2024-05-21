'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{

      userId: 1,
      name: 'test1',
      email: 'test1@email.com',
      password: '1234',
      status: 'active',
      wishlistId: 1,
      cartId: 1,
      role: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      userId: 2,
      name: 'test2',
      email: 'test2@email.com',
      password: '1234',
      status: 'active',
      wishlistId: 2,
      cartId: 2,
      role: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date()
      },
      {
        userId: 3,
      name: 'test3',
      email:'test3@email.com',
      password: '1234',
      status:'active',
      wishlistId: 3,
      cartId: 3,
      role: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // @ts-ignore
    await queryInterface.bulkDelete('Users', null, {});
  }
};
