'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`SELECT "userId" FROM "Users"`);

    const carts = users.map(user => ({
      cartId: uuidv4(),
      // @ts-ignore
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Carts', carts, {});

    for (const cart of carts) {
      await queryInterface.bulkUpdate('Users',
        { cartId: cart.cartId },
        { userId: cart.userId }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkUpdate('Users', { cartId: null }, { cartId: { [Sequelize.Op.ne]: null } });
  }
};
