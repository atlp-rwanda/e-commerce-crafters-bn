'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      vendorId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      bussinesName: {
        type: Sequelize.STRING
      },
      addresProof: {
        type: Sequelize.STRING
      },
      TIN: {
        type: Sequelize.INTEGER
      },
      bankAccount: {
        type: Sequelize.INTEGER
      },
      licence: {
        type: Sequelize.STRING
      },
      salesHistory: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendors');
  }
};