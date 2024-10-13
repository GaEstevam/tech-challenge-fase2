import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const database = env === 'test' ? ':memory:' : (process.env.DB_NAME as string);
const username = process.env.DB_USER as string;
const password = process.env.DB_PASS as string;
const host = env === 'test' ? undefined : (process.env.DB_HOST as string);
const dialect: Dialect = env === 'test' ? 'sqlite' : 'postgres';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false,
});

export default sequelize;
