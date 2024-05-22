'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      cartitemsid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      cartId: {
        type: Sequelize.STRING,
        references: {
          model: 'Carts',
          key: 'cartId'
        }
      },
      productId: {
      productId: {
        type: Sequelize.STRING,
        references: {
          model: 'Products',
          key: 'productId'
        }

      },
      quantity: {
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
  }
};

