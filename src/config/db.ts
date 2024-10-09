import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Carregar variáveis de ambiente

export const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Defina como true se quiser ver as queries SQL no console
  }
);

export default sequelize;
