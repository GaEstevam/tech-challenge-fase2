import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import { sequelize } from './config/db'; 


const app: Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
  })
  .catch((error: any) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Erro no servidor',
  });
});

export default app;
