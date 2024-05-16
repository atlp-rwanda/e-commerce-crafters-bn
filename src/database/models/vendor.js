'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init({
    vendorID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    businessName: DataTypes.STRING,
    addressProof: DataTypes.STRING,
    TIN: DataTypes.STRING,
    bankAccount: DataTypes.STRING,
    license: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};