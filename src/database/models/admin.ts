'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";



  class Admin  extends Model  {
    public adminId?: number
    public email!: string
    public permission!: string;
    static associate(models: any) {}
  }
  Admin.init({
    adminId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    email: {type:DataTypes.INTEGER,allowNull: false},
    permission: {type:DataTypes.INTEGER,allowNull: false,defaultValue: 'granted'},


  }, {
    sequelize: connectSequelize,
    modelName: 'Admin',
    tableName: 'admin'
  });

  export default Admin
