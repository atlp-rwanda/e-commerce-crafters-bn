'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [{
      productId: 1,
      vendorId: 1,
      name: 'Shoe',
      description: 'This is a shoe',
      discount: '2',
      price: 1000,
      quantity: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      productId: 2,
      vendorId: 1,
      name: 'Shirt',
      description: 'This is a shirt',
      discount: '5',
      price: 1500,
      quantity: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      productId: 3,
      vendorId: 1,
      name: 'Shirt',
      description: 'This is a shirt',
      discount: '5',
      price: 2500,
      quantity: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // @ts-ignore
    await queryInterface.bulkDelete('Products', null, {});
  }
};



