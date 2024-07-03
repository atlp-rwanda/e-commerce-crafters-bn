'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXhCG6nff2emBYOKGHb6jU2zQ4C2m0LBg4Mj-eydwZyg&s';
    const imageUrl2 = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3BmLXMxMDgtcG0tNDExMy1tb2NrdXAuanBn.jpg';
    const imageUrl3 = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D';
    const imageUrl4 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D';

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
      image: JSON.stringify([imageUrl,imageUrl2,imageUrl3,imageUrl4]),
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
