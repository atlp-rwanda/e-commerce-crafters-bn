'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [
      {
        adminId: uuidv4(),
        email: 'admin1@email.com',
        password: 'password1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        adminId: uuidv4(),
        email: 'admin2@email.com',
        password: 'password1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    await queryInterface.bulkDelete('Admins', null, {});

  }
};
