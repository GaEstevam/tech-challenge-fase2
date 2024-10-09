"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Supondo que você tenha um arquivo de configuração do Sequelize
// Definindo o modelo User
class User extends sequelize_1.Model {
}
// Inicializando o modelo User
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mobilePhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    creation_Date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    is_Active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('professor', 'aluno'),
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'users',
    modelName: 'User', // Nome do modelo
});
var Role;
(function (Role) {
    Role["PROFESSOR"] = "professor";
    Role["STUDENT"] = "student";
})(Role = exports.Role || (exports.Role = {}));
exports.default = User;
