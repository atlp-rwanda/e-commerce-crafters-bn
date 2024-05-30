'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
      vendorId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
          model: 'Users',
          key: 'userId'
        },
        onDelete: "CASCADE",
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
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
      },
      bankAccount:{
        type: Sequelize.BIGINT,
        unique: true
      },
      paymentDetails: {
        type: Sequelize.JSONB
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending"
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
