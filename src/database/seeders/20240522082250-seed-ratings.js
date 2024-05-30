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

    const [vendors] = await queryInterface.sequelize.query(`
      SELECT "vendorId"
      FROM "Vendors"
      LIMIT 3;
    `);

    const ratings = users.flatMap(user =>
      vendors.map(vendor => ({
        ratingId: uuidv4(),
        ratingScore: 5,
        // @ts-ignore
        userId: user.userId,
        // @ts-ignore
        vendorId: vendor.vendorId,
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
