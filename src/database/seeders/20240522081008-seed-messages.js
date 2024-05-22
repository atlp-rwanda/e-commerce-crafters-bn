'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Messages', [
      {
        contactId: uuidv4(),
        name: 'Testing',
        email: 'test@email.com',
        content: 'Hello thank you',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
       contactId: uuidv4(),
        name: 'Testing',
        email: 'test@email.com',
        content: 'Hello thanks',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
