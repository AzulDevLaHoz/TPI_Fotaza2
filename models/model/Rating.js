import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Rating extends Model { }

Rating.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
    },

    {
        sequelize,
        tableName: "rating",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);