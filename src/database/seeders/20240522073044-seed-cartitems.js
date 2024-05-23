'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [carts] = await queryInterface.sequelize.query(`
      SELECT "cartId"
      FROM "Carts"
      ORDER BY "createdAt" DESC
      LIMIT 3;
    `);

    const [products] = await queryInterface.sequelize.query(`
      SELECT "productId", "price"
      FROM "Products"
      LIMIT 3;
    `);

    const quantity = 10

    const cartItems = carts.flatMap(cart =>
      products.map(product => ({
        cartitemsid: uuidv4(),
        // @ts-ignore
        cartId: cart.cartId,
        // @ts-ignore
        productId: product.productId,
        quantity: quantity,
        // @ts-ignore
        price: product.price * quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      })))

    await queryInterface.bulkInsert('CartItems', cartItems, {});
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('CartItems', null, {})
  }
};
