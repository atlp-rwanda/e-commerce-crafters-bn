import connectSequelize from "../config/db.config";
import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";

interface UserAttributes {

    username: string,
    email: string,
    password: string
}

class User extends Model<UserAttributes> implements UserAttributes{
    public username!: string
    public email!: string
    public  password!: string
}

User.init({
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
     email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    sequelize: connectSequelize,
    tableName: 'Users',
    modelName: 'User',
    timestamps: true
})

export default User