import { sequelize } from './src/config/db';
import User from './src/models/user.model';  

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });  // Sincroniza o banco de dados e recria as tabelas
    console.log('Banco de dados sincronizado e tabelas criadas.');
    
    // Cria um usuário "Professor Teste" para os testes
    const user = await User.create({
      name: 'Professor Teste',
      username: 'professor_teste',
      password: 'senha_secreta',  
      email: 'professor@example.com',
      role: 'professor',  
    });

    // Armazena o ID do usuário globalmente para ser usado nos testes
    global.__userId__ = user.id;  
    console.log("Usuário criado com ID:", user.id);
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
});

// Fecha a conexão do banco de dados após todos os testes
afterAll(async () => {
  await sequelize.close();
});
