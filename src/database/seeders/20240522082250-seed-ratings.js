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
      SELECT "productId"
      FROM "Products"
      LIMIT 3;
    `);

    const ratings = users.flatMap(user =>
      products.map(product => ({
        ratingId: uuidv4(),
        name:"peter",
        ratingScore: 5,
        feedback: "good product",
        // @ts-ignore
        productId: product.productId,
        // @ts-ignore
        createdAt: new Date(),
        updatedAt: new Date()
      })))

    await queryInterface.bulkInsert('Ratings', ratings, {});

  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Ratings', null, {})
  }
};
