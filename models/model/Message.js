import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },

    {
        sequelize,
        tableName: "message",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);