import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        state: {
            type: DataTypes.ENUM(
                'active',
                'inactive',
                'review_pending'
            ),
            allowNull: false,
            defaultValue: 'active'
        },
    },

    {
        sequelize,
        tableName: "post",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);