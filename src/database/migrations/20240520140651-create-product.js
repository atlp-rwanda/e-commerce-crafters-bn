'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      productId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Vendors',
          key: 'vendorId'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      description:{
        type: Sequelize.STRING,
        allowNull: false
      },
      discount:{
        type: Sequelize.STRING,
        allowNull: false
      },
      price:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity:{
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Products');
  }
};