import { Model, DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import bcrypt from 'bcrypt';

export class User extends Model {
    // Metodo para verificar contrasena
    validatePassword(password) {
        return bcrypt.compare(password, this.password)
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    avatar: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM(
            'usuario',
            'validador',
            'admin'
        ),
        allowNull: false,
        defaultValue: 'usuario'
    },
    banned: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
        defaultValue: false
    },
},

    {
        sequelize,
        tableName: "user",
        timestamps: true,
        paranoid: true,
        underscored: true
    }
);

/* preguntar:

hooks: {
      beforeSave: async (usuario) => {
        if(!usuario.password) return;
        if(!usuario.changed('password')) return;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.password, salt)
        usuario.password = hashedPassword;
      }
*/