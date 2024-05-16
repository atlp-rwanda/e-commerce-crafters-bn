'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   
    static associate(models) {
      
    }z
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