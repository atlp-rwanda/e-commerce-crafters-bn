'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    userID: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    contactInfo: DataTypes.STRING,
    address: DataTypes.STRING,
    totalSpent: DataTypes.DECIMAL,
    wishlist: DataTypes.STRING,
    shoppingCart: DataTypes.INTEGER,
    orderHistory: DataTypes.INTEGER,
    dateJoined: DataTypes.DATE,
    lastLogin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};