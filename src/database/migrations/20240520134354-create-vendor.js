'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
      vendorId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Users',
          key: 'userId'
        }
      },
      storeName:{
        type: Sequelize.STRING,
        allowNull: false
      },
      address:{
        type: Sequelize.JSONB,
        allowNull: false
      },
      TIN:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bankAccount:{
        type: Sequelize.INTEGER,
      },
      paymentDetails: {
        type: Sequelize.JSONB
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
    await queryInterface.dropTable('Vendors');
  }
};