'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Vendors', [{
     vendorId: 1,
      userId: 3,
      storeName: 'vendorStore1',
      address: { district: 'gasabo' },
      TIN: 12312,
      bankAccount: 12312,
      paymentDetails: {
        phoneNumber: '07870000001'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // @ts-ignore
    await queryInterface.bulkDelete('Vendors', null, {});
  }
};




