import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? 'sqlite::memory:' : process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: isTest ? undefined : process.env.DB_HOST,
    dialect: isTest ? 'sqlite' : ('postgres' as Dialect),
    logging: false,
  }
);

export default sequelize;
