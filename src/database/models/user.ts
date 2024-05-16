'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";



  class User  extends Model  {
    public userId?: number
    public firstName!: string;
    public lastName!: string;
    public userName!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public contactInfo!: string;
    public address!: string;
    public totalSpent!: string;
    public wishlist!: string;
    public shoppingCart!: string;
    public orderHistory!: string;
    public dateJoined!: Date;
    public lastLogin!: Date;

    static associate(models: any) {
      User.hasMany(models.Cart,{
        foreignKey: 'userId',
        as: 'carts'
      })
      User.hasMany(models.Wishlist,{
        foreignKey: 'userId',
        as: 'wish'
      })
   
    }
  }
  User.init({
    userID: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    firstName: {type:DataTypes.STRING,allowNull:false},
    lastName: {type:DataTypes.STRING,allowNull:false},
    userName: {type:DataTypes.STRING,allowNull:false},
    email: {type:DataTypes.STRING,allowNull:false},
    password: {type:DataTypes.STRING,allowNull:false},
    role: {type:DataTypes.STRING,allowNull:false},
    contactInfo: {type:DataTypes.STRING,allowNull:false},
    address: {type:DataTypes.STRING,allowNull:false},
    totalSpent: {type:DataTypes.STRING,allowNull:false},
    wishlist:{type:DataTypes.STRING,allowNull:false},
    shoppingCart: {type:DataTypes.STRING,allowNull:false},
    orderHistory: {type:DataTypes.STRING,allowNull:false},
    dateJoined: {type:DataTypes.STRING,allowNull:false},
    lastLogin: {type:DataTypes.DATE,allowNull:false}
  }, {
    sequelize: connectSequelize,
    modelName: 'User',
    tableName: 'users'
  });

  export default User
