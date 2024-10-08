import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import { connectDB } from './config/db'; // Ajuste o caminho conforme necessário

// Cria a aplicação Express
const app: Application = express();

// Middleware para lidar com CORS e parsing do body
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Conectar ao PostgreSQL
connectDB().catch((error) => {
  console.error('Erro ao conectar ao PostgreSQL:', error);
});

// Middleware para capturar erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Erro no servidor',
  });
});

export default app;
