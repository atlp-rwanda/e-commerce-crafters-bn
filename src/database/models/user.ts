"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";
import connectSequelize from "../config/db.config";
import models from ".";

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
  public resetPasswordToken?: string | null;
  public resetPasswordExpires?: Date | null;
  public isTwoFactorEnabled?: boolean; 

  static associate(models: any) {
    User.hasMany(models.Review, {
      foreignKey: "userId",
    });
  }
  static initModel(sequelize: Sequelize) {
    User.init(
      {
        userId: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "active" },
        wishlistId: { type: DataTypes.STRING },
        cartId: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING, defaultValue: "buyer" },
        profile: {
          type: DataTypes.STRING,
          defaultValue:
            "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
        },
        resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
        resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
        isTwoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      {
        sequelize: connectSequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: true,
      }
    );
    return User;
  }
}

User.initModel(connectSequelize);

export default User;
