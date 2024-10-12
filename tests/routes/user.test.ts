import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('User Routes', () => {
  let token: string;

  beforeAll(async () => {
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
  
    expect(response.statusCode).toBe(201); 
    expect(response.body).toHaveProperty('token'); 
  });
  

  it('Deve permitir login de um usuário', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'novo@usuario.com',
        password: 'senha123',
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('token'); 
  });

  it('Deve listar todos os usuários', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`); 

    expect(response.statusCode).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true); 
  });

  it('Deve retornar um usuário específico pelo ID', async () => {
    const response = await request(app)
      .get('/api/users/1') 
      .set('Authorization', `Bearer ${token}`); 

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('id'); 
    expect(response.body.id).toBe(1); 
  });

  it('Deve retornar 404 ao buscar usuário inexistente', async () => {
    const response = await request(app)
      .get('/api/users/999') 
      .set('Authorization', `Bearer ${token}`); 

    expect(response.statusCode).toBe(404); 
    expect(response.body.message).toBe('Usuário não encontrado.'); 
  });
});
