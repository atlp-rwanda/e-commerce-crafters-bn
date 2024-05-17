'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'users',
          key: 'userId'
        }
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orderDate:{
        type: Sequelize.DATE,
        allowNull: false
      },
      status:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'

      },
      orderItems:{
        type: Sequelize.STRING,
        allowNull: false
      },
      totalAmount:{
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('orders');
  }
};