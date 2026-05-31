import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Notification extends Notification { }

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
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
        tableName: "Notification",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);