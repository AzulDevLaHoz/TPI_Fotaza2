import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Collection extends Model {}

Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    },

    {
        sequelize,
        tableName: "collection",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);