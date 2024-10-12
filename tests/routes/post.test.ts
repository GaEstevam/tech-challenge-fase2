import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('POST /api/posts/create', () => {
  it('Deve criar um novo post com o userId do usuário logado', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },  // Usa o ID do usuário criado no setupTests.ts
      process.env.JWT_SECRET || 'Sua Senha',  // Use o segredo configurado no .env
      { expiresIn: '1h' }  // Expira em 1 hora
    );

    const response = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
        themeId: 1,  // Substitua com o valor necessário
      })
      .set('Authorization', `Bearer ${token}`);  // Envia o token JWT

    expect(response.statusCode).toBe(201);  // Verifica se a resposta é 201 Created
    expect(response.body).toHaveProperty('id');  // Verifica se o post foi criado com um ID
    expect(response.body.title).toBe('Post de Teste');  // Verifica o título do post
    expect(response.body.userId).toBe(global.__userId__);  // Verifica se o post tem o userId correto
  });
});

describe('PUT /api/posts/edit/:id', () => {
  it('Deve editar um post existente com o userId do professor logado', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .put('/api/posts/edit/1') // Suponha que o post com ID 1 já exista
      .send({
        title: 'Novo título do Post',
        description: 'Nova descrição do post',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  // Verifica se o status é 200 OK
    expect(response.body.title).toBe('Novo título do Post');  // Verifica se o título foi atualizado
    expect(response.body.description).toBe('Nova descrição do post');  // Verifica se a descrição foi atualizada
  });
});

describe('DELETE /api/posts/delete/:id', () => {
  it('Deve deletar um post existente com o userId do professor logado', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .delete('/api/posts/delete/1')  // Suponha que o post com ID 1 já exista
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  // Verifica se o status é 200 OK
    expect(response.body.message).toBe('Postagem excluída com sucesso.');  // Verifica se a mensagem de sucesso é retornada
  });
});

describe('GET /api/posts', () => {
  it('Deve listar todos os posts', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  // Verifica se o status é 200 OK
    expect(response.body).toBeInstanceOf(Array);  // Verifica se o corpo da resposta é um array
  });
});

describe('GET /api/posts/:id', () => {
  it('Deve retornar um post específico pelo ID', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    // Cria um post antes de tentar buscá-lo
    const postResponse = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    // Usa o ID do post criado na resposta anterior
    const postId = postResponse.body.id;

    const response = await request(app)
      .get(`/api/posts/${postId}`)  // Usa o ID real do post criado
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  // Verifica se o status é 200 OK
    expect(response.body).toHaveProperty('id');  // Verifica se o post tem um ID
    expect(response.body.id).toBe(postId);  // Verifica se o ID do post é o esperado
  });
});



describe('GET /api/posts/search/:title', () => {
  it('Deve buscar postagens pelo título', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    // Primeiro, crie um post para garantir que há um título para buscar
    await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/api/posts/search/Post de Teste')  // Busca posts com título semelhante a "Post de Teste"
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  // Verifica se o status é 200 OK
    expect(response.body).toBeInstanceOf(Array);  // Verifica se o corpo da resposta é um array
    expect(response.body.length).toBeGreaterThan(0);  // Verifica se encontrou algum post
  });
});

