import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('POST /api/posts/create', () => {
  it('Deve criar um novo post com o userId do usuário logado', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },  
      process.env.JWT_SECRET || 'Sua Senha',  
      { expiresIn: '1h' }  
    );

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
    expect(response.body.userId).toBe(global.__userId__);  
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
      .put('/api/posts/edit/1') 
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
  it('Deve deletar um post existente com o userId do professor logado', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .delete('/api/posts/delete/1')  
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  
    expect(response.body.message).toBe('Postagem excluída com sucesso.');  
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

    expect(response.statusCode).toBe(200);  
    expect(response.body).toBeInstanceOf(Array);  
  });
});

describe('GET /api/posts/:id', () => {
  it('Deve retornar um post específico pelo ID', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    
    const postResponse = await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
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



describe('GET /api/posts/search/:title', () => {
  it('Deve buscar postagens pelo título', async () => {
    const token = jwt.sign(
      { id: global.__userId__, role: 'professor' },
      process.env.JWT_SECRET || 'Sua Senha',
      { expiresIn: '1h' }
    );

    
    await request(app)
      .post('/api/posts/create')
      .send({
        title: 'Post de Teste',
        description: 'Descrição do post de teste',
        themeId: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/api/posts/search/Post de Teste')  
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);  
    expect(response.body).toBeInstanceOf(Array);  
    expect(response.body.length).toBeGreaterThan(0);  
  });
});

