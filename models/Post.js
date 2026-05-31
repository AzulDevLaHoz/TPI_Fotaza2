import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Posts extends Model {}

Posts.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.TEXT(300),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 'active'
        },
        state: {
            type: DataTypes.ENUM(
                'active',
                'inactive',
                'review_pending'
            ),
            allowNull: false,
        },
    },

    {
        sequelize,
        tableName: "Post",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);