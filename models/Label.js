import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Label extends Model {}

Label.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
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
        tableName: "Label",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);