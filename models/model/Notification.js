import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Notification extends Model { }

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },

    {
        sequelize,
        tableName: "notification",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);