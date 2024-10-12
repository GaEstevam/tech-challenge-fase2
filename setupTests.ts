import { sequelize } from './src/config/db';
import User from './src/models/user.model';  

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });  
    console.log('Banco de dados sincronizado e tabelas criadas.');
    
    const user = await User.create({
      name: 'Professor Teste',
      username: 'professor_teste',
      password: 'senha_secreta',  
      email: 'professor@example.com',
      role: 'professor',  
    });

    global.__userId__ = user.id;  
    console.log("Usuário criado com ID:", user.id);
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});
