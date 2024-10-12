import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('User Routes', () => {
  let token: string;

  beforeAll(async () => {
    // Cria um token JWT para um professor
    token = jwt.sign(
      { id: 1, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );
  });

  it('Deve criar um novo usuário', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Novo Usuário',
        username: 'novo_usuario',
        password: 'senha123',
        email: 'novo@usuario.com',
        mobilePhone: '1234567890',
        role: "professor",
      });
  
    expect(response.statusCode).toBe(201); // Verifica se o status é 201 Created
    expect(response.body).toHaveProperty('token'); // Verifica se o token é retornado
  });
  

  it('Deve permitir login de um usuário', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'novo@usuario.com',
        password: 'senha123',
      });

    expect(response.statusCode).toBe(200); // Verifica se o status é 200 OK
    expect(response.body).toHaveProperty('token'); // Verifica se o token é retornado
  });

  it('Deve listar todos os usuários', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`); // Envia o token

    expect(response.statusCode).toBe(200); // Verifica se o status é 200 OK
    expect(Array.isArray(response.body)).toBe(true); // Verifica se a resposta é um array
  });

  it('Deve retornar um usuário específico pelo ID', async () => {
    const response = await request(app)
      .get('/api/users/1') // Substitua pelo ID do usuário
      .set('Authorization', `Bearer ${token}`); // Envia o token

    expect(response.statusCode).toBe(200); // Verifica se o status é 200 OK
    expect(response.body).toHaveProperty('id'); // Verifica se o usuário foi encontrado
    expect(response.body.id).toBe(1); // Verifica se o ID do usuário é o esperado
  });

  it('Deve retornar 404 ao buscar usuário inexistente', async () => {
    const response = await request(app)
      .get('/api/users/999') // ID que não existe
      .set('Authorization', `Bearer ${token}`); // Envia o token

    expect(response.statusCode).toBe(404); // Verifica se o status é 404 Not Found
    expect(response.body.message).toBe('Usuário não encontrado.'); // Mensagem correta
  });
});
