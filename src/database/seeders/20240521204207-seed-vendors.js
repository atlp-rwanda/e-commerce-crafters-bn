'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT "userId" 
      FROM "Users" 
      ORDER BY "createdAt" DESC 
      LIMIT 3;
    `);

    const vendors = users.map(user => ({
      vendorId: uuidv4(),
      // @ts-ignore
      userId: user.userId,
      storeName: `Store ${Math.floor(Math.random() * (11))}`,
      address: JSON.stringify({
        street: 'KG 111 ST',
        city: 'Kigali'
      }),
      TIN: Math.floor(Math.random() * 100000000),
      bankAccount: Math.floor(Math.random() * 1000000000),
      paymentDetails: JSON.stringify({
        method: 'Bank Transfer',
        bankName: 'Bank Of Kigali'
      }),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('Vendors', vendors, {});

    await queryInterface.bulkUpdate('Users',
      { role: 'vendor' },
      // @ts-ignore
      { userId: users.map(user => user.userId) }
    );
  },


  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Vendors', null, {});
    await queryInterface.bulkUpdate('Users', { role: 'buyer' }, { role: 'vendor' });
  }
};
