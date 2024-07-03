'use strict';

const { JSONB } = require('sequelize');

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
        references: {
          model: 'Vendors',
          key: 'vendorId'
        },
        onDelete: "CASCADE"
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: JSONB,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expiringDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      expired: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      available: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};

