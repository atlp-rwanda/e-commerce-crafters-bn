'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subscriptions', [
      {
        subscriptionId: uuidv4(),
        email: 'subscriber1@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: uuidv4(),
        email: 'subscriber2@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: uuidv4(),
        email: 'subscriber3@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Subscriptions', null, {});
  }
};
