import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Rating extends Rating {}

Rating.init(
    {
        id: {
            type: DataTypes.INTEGER(20),
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
        tableName: "Rating",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);