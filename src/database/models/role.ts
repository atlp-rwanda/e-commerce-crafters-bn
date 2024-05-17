'use strict';
import { Model,DataTypes } from "sequelize";
import connectSequelize from "../config/dbconfig";

  class Role  extends Model  {
    public roleId?: number
    public roleName!: string;
    static associate(models: any) {}
  }
  Role.init({
    roleId: {type:DataTypes.INTEGER,primaryKey: true,autoIncrement: true},
    roleName: {type:DataTypes.STRING,allowNull: false}
  }, {
    sequelize: connectSequelize,
    modelName: 'Role',
    tableName: 'role'
  });

  export default Role
