'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Carts', [{

      cartId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      cartId: 2,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cartId: 3,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // @ts-ignore
    await queryInterface.bulkDelete('Carts', null, {});
  }
}
