import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tech_challenge', 'postgres', 'suasenha', {
  host: 'localhost',
  dialect: 'postgres',
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao PostgreSQL');
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL', error);
    process.exit(1); // Encerra o processo em caso de falha
  }
};

export { sequelize, connectDB };
