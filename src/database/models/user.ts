'use strict';
import { Model, DataTypes } from 'sequelize';
import connectSequelize from '../config/db.config';

class User extends Model {
  public userId?: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public status!: string;
  public wishlistId?: string;
  public cartId?: string;
  public role!: string;
  public profile?: string;
  public isVerified?: boolean;
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;

    static associate(models: any) {
       User.hasMany(models.Rating,{
        foreignKey: 'userId',
        as: 'rating'
       })
       User.hasOne(models.Cart, {
         foreignKey: "userId",
         as: "cart"
       });
       User.hasOne(models.Wishlist, {
         foreignKey: "userId",
         as: "wishlist"
       });
    }
  }
  User.init({
    userId: {type:DataTypes.UUID,primaryKey: true,defaultValue: DataTypes.UUIDV4},
    name: {type:DataTypes.STRING,allowNull: false},
    email: {type:DataTypes.STRING,allowNull: false},
    password: {type:DataTypes.STRING,allowNull: false},
    status: {type:DataTypes.STRING,defaultValue: 'active'},
    wishlistId: {type:DataTypes.STRING},
    cartId: {type:DataTypes.STRING},
    role: {type:DataTypes.STRING,defaultValue:'buyer'},  
    profile: {type:DataTypes.STRING,defaultValue: "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"},  
  }, {
    sequelize: connectSequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
