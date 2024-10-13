import request from 'supertest';
import app from '../../src/app';

let token: string;
let userId: number;

beforeAll(async () => {
  const email = `professor${Date.now()}@example.com`;

  const userResponse = await request(app).post('/api/users/register').send({
    name: 'Professor Teste',
    username: 'professor_teste',
    password: 'senha123',
    email: email,
    mobilePhone: '1234567890',
    role: 'professor',
  });

  userId = userResponse.body.id;

  const loginResponse = await request(app).post('/api/users/login').send({
    email: email,
    password: 'senha123',
  });

  token = loginResponse.body.token;
});

describe('POST /api/posts/create', () => {
  it('Deve criar um novo post com o userId do professor logado', async () => {
    const response = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Post de Teste');
  });
});

describe('PUT /api/posts/edit/:id', () => {
  it('Deve editar um post existente', async () => {
    const postResponse = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post para Edição',
        description: 'Descrição do post para edição',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const postId = postResponse.body.id;

    const response = await request(app)
      .put(`/api/posts/edit/${postId}`)
      .send({
        title: 'Novo título do Post',
        description: 'Nova descrição do post',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Novo título do Post');
    expect(response.body.description).toBe('Nova descrição do post');
  });
});

describe('DELETE /api/posts/delete/:id', () => {
  it('Deve deletar um post existente', async () => {
    const postResponse = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post para Deleção',
        description: 'Descrição do post para deleção',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const postId = postResponse.body.id;

    const response = await request(app)
      .delete(`/api/posts/delete/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Postagem excluída com sucesso.');
  });
});

describe('GET /api/posts', () => {
  it('Deve listar todos os posts', async () => {
    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /api/posts/:id', () => {
  it('Deve retornar um post específico pelo ID', async () => {
    const postResponse = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post para Busca',
        description: 'Descrição do post para busca',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const postId = postResponse.body.id;

    const response = await request(app)
      .get(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(postId);
  });
});

describe('GET /api/posts/search/:query', () => {
  it('Deve buscar postagens', async () => {
    await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post para Busca',
        description: 'Descrição do post para busca',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/api/posts/search/Post para Busca')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
