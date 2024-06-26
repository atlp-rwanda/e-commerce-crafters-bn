'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      productId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      vendorId: {
        type: Sequelize.STRING,
        references:{
          model: 'Vendors',
          key: 'vendorId'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image:{
        type: Sequelize.STRING,
        allowNull: false
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
      category:{
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
    await queryInterface.dropTable('Products');
  }
};