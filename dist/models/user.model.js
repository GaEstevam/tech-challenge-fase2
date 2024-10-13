"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
}
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
    sequelize: db_1.default,
    tableName: 'users',
    modelName: 'User',
    schema: 'public',
});
var Role;
(function (Role) {
    Role["PROFESSOR"] = "professor";
    Role["STUDENT"] = "student";
})(Role = exports.Role || (exports.Role = {}));
exports.default = User;
