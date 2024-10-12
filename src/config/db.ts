import { Sequelize, Dialect } from 'sequelize'; 
import dotenv from 'dotenv';
import * as config from '../../config/config.json'; 

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect; 
  logging?: boolean;
}

const environments = ['development', 'test', 'production'] as const;
type Environment = typeof environments[number];

const env: Environment = (process.env.NODE_ENV as Environment) || 'development';

const dbConfig: DBConfig = (config as any)[env];

export const sequelize = new Sequelize({
  database: isTest ? 'sqlite::memory:' : dbConfig.database, 
  username: isTest ? undefined : dbConfig.username, 
  password: isTest ? undefined : dbConfig.password, 
  host: isTest ? undefined : dbConfig.host, 
  dialect: isTest ? 'sqlite' : dbConfig.dialect,
  logging: dbConfig.logging || false, 
});

export default sequelize;
