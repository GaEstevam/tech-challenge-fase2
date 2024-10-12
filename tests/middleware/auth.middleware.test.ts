import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  it('Deve permitir acesso com token válido', async () => {
    const token = jwt.sign(
      { id: 1, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/api/posts') 
      .set('Authorization', `Bearer ${token}`); 

    expect(response.statusCode).toBe(200); 
  });

  it('Deve negar acesso sem token', async () => {
    const response = await request(app)
      .get('/api/posts'); 

    expect(response.statusCode).toBe(401); 
    expect(response.body.message).toBe('Token não fornecido'); 
  });

  it('Deve negar acesso com token inválido', async () => {
    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', 'Bearer token_invalido'); 

    expect(response.statusCode).toBe(401); 
    expect(response.body.message).toBe('Token inválido'); 
  });
});
