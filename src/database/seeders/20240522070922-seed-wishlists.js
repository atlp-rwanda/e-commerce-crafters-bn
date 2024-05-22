'use strict';

// @ts-ignore
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT "userId"
      FROM "Users"
      ORDER BY "createdAt" DESC
      LIMIT 3;
    `);

    const [products] = await queryInterface.sequelize.query(`
      SELECT "productId"
      FROM "Products"
      LIMIT 3;
    `);

    const wishlists = users.flatMap(user =>
      products.map(product => ({
        wishlistId: uuidv4(),
        // @ts-ignore
        userId: user.userId,
        // @ts-ignore
        productId: product.productId,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert('Wishlists', wishlists, {});

    for (const wishlist of wishlists) {
      await queryInterface.bulkUpdate('Users',
        { wishlistId: wishlist.wishlistId },
        { userId: wishlist.userId }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkUpdate('Users', { wishlistId: null }, { wishlistId: { [Sequelize.Op.ne]: null } });
  }
};
