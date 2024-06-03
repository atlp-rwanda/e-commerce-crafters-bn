import { Model, DataTypes, Sequelize, UUIDV4 } from "sequelize";
import connectSequelize from "../config/db.config";

class Notification extends Model {
    public id!: string;
    public message!: string;
    public vendorId?: string;
    public isRead!: boolean;


    static initModel(sequelize: Sequelize) {
        Notification.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                },
                message: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isRead: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                vendorId: {
                    type: DataTypes.STRING,
                    defaultValue: DataTypes.UUIDV4,
                },
            },
            {
                sequelize: connectSequelize,
                modelName: "Notification",
                tableName: "Notifications",
                timestamps: true,
            }
        );

        return Notification
    }
}

Notification.initModel(connectSequelize);

export default Notification;
