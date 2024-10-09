import express, { Request, Response, Router } from 'express';
import Post from '../models/post.model'; // Assumindo o caminho do modelo Post
import User from '../models/user.model'; // Assumindo o caminho do modelo User
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.middleware'; // Middleware para autenticação
import { Role } from '../models/user.model'; // Enum para roles, onde há a role 'professor'

const router = Router();

// Middleware para verificar se o usuário é um professor
const isProfessor = (req: Request, res: Response, next: Function) => {
  if (!req.user || req.user.role !== Role.PROFESSOR) {
    console.log('Acesso negado: Usuário não é professor');
    return res.status(403).json({ message: 'Acesso negado. Apenas professores podem criar ou editar posts.' });
  }
  next();
};

// Rota para criar um post
router.post('/create', authMiddleware, isProfessor, async (req: Request, res: Response) => {
  try {
    const { title, description, themeId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado.' });
    }

    // Criação do post
    const post = await Post.create({
      title,
      description,
      themeId,
      userId,
    });

    // Envia a resposta e interrompe o fluxo aqui
    res.status(201).json(post);
    return;  // Garante que a função encerra após enviar a resposta
  } catch (error) {
    // Logando o erro e retornando a resposta apenas uma vez
    if (!res.headersSent) {
      console.error('Erro ao criar o post:', error);
      return res.status(500).json({ message: 'Erro ao criar o post.', error });
    } else {
      console.error('Erro crítico: headers já enviados, mas erro detectado.', error);
    }
  }
});




// Rota para editar um post
router.put('/edit/:id', authMiddleware, isProfessor, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, themeId } = req.body;
    const userId = req.user.id;

    // Encontra o post pelo ID e verifica se o criador é o usuário atual
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      console.log('Post não encontrado ou sem permissão para edição');
      return res.status(404).json({ message: 'Post não encontrado ou você não tem permissão para editá-lo.' });
    }

    // Atualiza o post
    post.title = title || post.title;
    post.description = description || post.description;
    post.themeId = themeId || post.themeId;
    await post.save();

    console.log('Post editado com sucesso:', post);
    return res.status(200).json(post);
  } catch (error) {
    console.error('Erro ao editar o post:', error);
    return res.status(500).json({ message: 'Erro ao editar o post.', error });
  }
});

// Rota para listar todos os posts com o nome do professor associado
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username'], // Apenas o username do professor
      }]
    });

    console.log('Posts encontrados:', posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar os posts:', error);
    return res.status(500).json({ message: 'Erro ao buscar os posts.', error });
  }
});

// Rota para buscar uma postagem específica por ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      include: [{ model: User, as: 'creator', attributes: ['username'] }]
    });

    if (!post) {
      console.log('Postagem não encontrada');
      return res.status(404).json({ message: 'Postagem não encontrada.' });
    }

    console.log('Postagem encontrada:', post);
    return res.status(200).json(post);
  } catch (error) {
    console.error('Erro ao buscar a postagem:', error);
    return res.status(500).json({ message: 'Erro ao buscar a postagem.', error });
  }
});

// Rota para pesquisar postagens pelo título
router.get('/search/:title', authMiddleware, async (req: Request, res: Response) => {
  const { title } = req.params;

  try {
    const posts = await Post.findAll({
      where: { title: { [Op.like]: `%${title}%` } },
      include: [{ model: User, as: 'creator', attributes: ['username'] }]
    });

    if (posts.length === 0) {
      console.log('Nenhuma postagem encontrada com esse título');
      return res.status(404).json({ message: 'Nenhuma postagem encontrada com esse título.' });
    }

    console.log('Postagens encontradas:', posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao pesquisar postagens:', error);
    return res.status(500).json({ message: 'Erro ao pesquisar postagens.', error });
  }
});

// Rota para excluir uma postagem
router.delete('/delete/:id', authMiddleware, isProfessor, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      console.log('Post não encontrado ou sem permissão para exclusão');
      return res.status(404).json({ message: 'Post não encontrado ou você não tem permissão para excluí-lo.' });
    }

    await post.destroy();
    console.log('Post excluído com sucesso');
    return res.status(200).json({ message: 'Postagem excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir a postagem:', error);
    return res.status(500).json({ message: 'Erro ao excluir a postagem.', error });
  }
});

export default router;
