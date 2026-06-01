import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Comment extends Model {}

Comment.init(
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
    },

    {
        sequelize,
        tableName: "comment",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);