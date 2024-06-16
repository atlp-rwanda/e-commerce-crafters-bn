'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT "userId"
      FROM "Users"
      LIMIT 3;
    `);

    const [products] = await queryInterface.sequelize.query(`
      SELECT "productId", "name"
      FROM "Products"
      LIMIT 3;
    `);

    const orders = users.flatMap(user =>
      products.map(product => ({
        orderId: uuidv4(),
        deliveryAddress: JSON.stringify({
          street: 'KG 111 ST',
          city: 'Kigali'
        }),
        // @ts-ignore
        userId: user.userId,
        paymentMethod: 'Bank Transfer',
        status: 'pending',
        products: JSON.stringify([{
          // @ts-ignore
          productId: product.productId,
          // @ts-ignore
          productName: product.name,
          quantity: 3
        }]),
        createdAt: new Date(),
        updatedAt: new Date()
      })))

    await queryInterface.bulkInsert('Orders', orders, {});

  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Orders', null, {})
  }
};
