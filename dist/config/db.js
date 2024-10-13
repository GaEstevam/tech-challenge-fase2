"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env.NODE_ENV || 'development';
const database = env === 'test' ? ':memory:' : process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = env === 'test' ? undefined : process.env.DB_HOST;
const dialect = env === 'test' ? 'sqlite' : 'postgres';
const sequelize = new sequelize_1.Sequelize(database, username, password, {
    host,
    dialect,
    logging: false,
});
exports.default = sequelize;
