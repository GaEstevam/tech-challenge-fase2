import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import { sequelize } from './config/db'; // Usar import para consistência
// Removi a função connectDB, pois o sequelize.sync já conecta ao DB

// Cria a aplicação Express
const app: Application = express();

// Middleware para lidar com CORS e parsing do body
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Sincronize o banco de dados e conecte ao PostgreSQL
sequelize.sync({ alter: true }) // Evite { force: true } em produção, pois apaga dados
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
  })
  .catch((error: any) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

// Middleware para capturar erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Erro no servidor',
  });
});

export default app;
