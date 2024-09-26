import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';

// Cria a aplicação Express
const app: Application = express();

// Middleware para lidar com CORS e parsing do body
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tech-challenge';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumenta o tempo limite para selecionar o servidor
  socketTimeoutMS: 45000, // Aumenta o tempo limite do socket
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
// Middleware para capturar erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Erro no servidor',
  });
});

export default app;
