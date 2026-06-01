import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

export class Report extends Model { }

Report.init(
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        reportType: {
            type: DataTypes.ENUM(
                'Spam',
                'Contenido Explícito',
                'Discriminación o Acoso',
                'Contenido Sexual',
                'Otro'
            ),
            allowNull: false
        }
    },

    {
        sequelize,
        tableName: "report",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);