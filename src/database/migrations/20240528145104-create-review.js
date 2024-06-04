'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      reviewId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      rating:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      feedback:{
        type: Sequelize.STRING,

      },
      userId:{
        type: Sequelize.STRING,
        references:{
          model: "Users",
          key: "userId"
        }

      },
      productId: {
        type: Sequelize.STRING,
        references:{
          model: "Products",
          key: "productId"

        }
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
    await queryInterface.dropTable('Reviews');
  }
};