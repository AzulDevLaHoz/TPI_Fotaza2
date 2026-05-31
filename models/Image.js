import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Image extends Model {}

Image.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        file: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        copyright: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 'false'
        },
        copyrightText: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        activeComments: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        copyrightText: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
    },

    {
        sequelize,
        tableName: "Image",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);