import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Comment extends Comment {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
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
        tableName: "Comment",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);