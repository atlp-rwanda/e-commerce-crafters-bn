'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deliveryAddress: {
        type: Sequelize.JSONB
      },
      userId:{
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key: 'userId'
        }

      },
      paymentMethod:{
        type: Sequelize.STRING,
        allowNull: false
      },
      status:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      products:{
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
    await queryInterface.dropTable('Orders');
  }
};