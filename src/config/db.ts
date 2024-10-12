import { Sequelize, Dialect } from 'sequelize'; // Importa o enum Dialect
import dotenv from 'dotenv';
import * as config from '../../config/config.json'; // Importa o JSON de configuração

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Define uma interface para os ambientes do banco de dados, incluindo o Dialect
interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect; // O tipo Dialect é importado do Sequelize
  logging?: boolean;
}

// Define os ambientes permitidos
const environments = ['development', 'test', 'production'] as const;
type Environment = typeof environments[number];

const env: Environment = (process.env.NODE_ENV as Environment) || 'development';

// Obtém a configuração do banco de dados com base no ambiente
const dbConfig: DBConfig = (config as any)[env];

// Cria a instância do Sequelize com a configuração apropriada
export const sequelize = new Sequelize({
  database: isTest ? 'sqlite::memory:' : dbConfig.database, 
  username: isTest ? undefined : dbConfig.username, 
  password: isTest ? undefined : dbConfig.password, 
  host: isTest ? undefined : dbConfig.host, 
  dialect: isTest ? 'sqlite' : dbConfig.dialect,
  logging: dbConfig.logging || false, 
});

// Exporta a instância do Sequelize
export default sequelize;
