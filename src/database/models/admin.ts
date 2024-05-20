'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/db.config";

  class Admin  extends Model  {
    public adminId?: number
    public email!: string;
    public password!: string;
    static associate(models: any) {
    }
  }
  Admin.init({
    adminId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    email: {type:DataTypes.STRING,allowNull: false},
    password: {type:DataTypes.STRING,allowNull: false},

  }, {
    sequelize: connectSequelize,
    modelName: 'Admin',
    tableName: 'Ratings',
    timestamps: true
  });

  export default Admin
