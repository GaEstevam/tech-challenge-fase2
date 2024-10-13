import sequelize from './src/config/db';
import User from './src/models/user.model';
import jwt from 'jsonwebtoken';

let token: string;

declare global {
  var __userId__: number;
  var __token__: string;
}

beforeAll(async () => {
  await sequelize.sync({ force: true });
  console.log('Banco de dados sincronizado e tabelas criadas.');

  const user = await User.create({
    name: 'Usuário Padrão',
    username: 'usuario_padrao',
    password: 'senha123',
    email: `usuario_padrao@example.com`,
    role: 'professor',
  });

  global.__userId__ = user.id;

  token = jwt.sign(
    { id: global.__userId__, role: user.role },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1h' }
  );

  global.__token__ = token;

  console.log(`Usuário criado com ID: ${global.__userId__}`);
  console.log(`Token gerado: ${global.__token__}`);
});

afterAll(async () => {
  await sequelize.close();
  console.log('Conexão com o banco de dados encerrada.');
});
