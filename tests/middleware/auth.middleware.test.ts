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
      .get('/api/posts') // Endpoint protegido
      .set('Authorization', `Bearer ${token}`); // Envia o token

    expect(response.statusCode).toBe(200); // Verifica se o acesso foi permitido
  });

  it('Deve negar acesso sem token', async () => {
    const response = await request(app)
      .get('/api/posts'); // Endpoint protegido

    expect(response.statusCode).toBe(401); // Verifica se o status é 401 Unauthorized
    expect(response.body.message).toBe('Token não fornecido'); // Mensagem correta
  });

  it('Deve negar acesso com token inválido', async () => {
    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', 'Bearer token_invalido'); // Token inválido

    expect(response.statusCode).toBe(401); // Verifica se o status é 401 Unauthorized
    expect(response.body.message).toBe('Token inválido'); // Mensagem correta
  });
});
