import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Label extends Model {}

Label.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true
        },
    },

    {
        sequelize,
        tableName: "label",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);