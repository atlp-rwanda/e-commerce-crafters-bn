'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const imageUrl = 'http://pluspng.com/img-png/nike-running-shoes-png-image-transparent-free-download-1200.png';

    const [vendors] = await queryInterface.sequelize.query(`
      SELECT "vendorId" 
      FROM "Vendors" 
      ORDER BY "createdAt" DESC 
      LIMIT 3;
    `);

    const products = vendors.map(vendor => ({
      productId: uuidv4(),
      // @ts-ignore
      vendorId: vendor.vendorId,
      name: 'nike shoes',
      image: imageUrl,
      description: 'These are nike shoes.',
      discount: 2,
      price: 12000,
      quantity: 100,
      category: 'Shoes',
      createdAt: new Date(),
      updatedAt: new Date(),
      expired: false,
      available: true
    }));

    await queryInterface.bulkInsert('Products', products, {});
  },


  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Products', null, {});
  }
};
