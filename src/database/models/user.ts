'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class User  extends Model  {
    public userId?: number
    public name!: string
    public email!: string
    public password!: string
    public status!: string
    public wishlistId!: number
    public cartId!: number
    public role!: string

    static associate(models: any) {
       User.hasMany(models.Rating,{
        foreignKey: 'userId',
        as: 'rating'
       })
       User.hasOne(models.Cart,{
        foreignKey: 'userId',
        as: 'cart'
       })
       User.hasOne(models.Wishlist,{
        foreignKey: 'userId',
        as: 'wishlist'
       })
    }
  }
  User.init({
    userId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    name: {type:DataTypes.STRING,allowNull: false},
    email: {type:DataTypes.STRING,allowNull: false},
    status: {type:DataTypes.STRING,defaultValue: 'active'},
    wishlistId: {type:DataTypes.INTEGER},
    cartId: {type:DataTypes.INTEGER},
    role: {type:DataTypes.STRING,defaultValue:'buyer'},
  }, {
    sequelize: connectSequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  export default User
