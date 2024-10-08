import { Router, Request, Response } from 'express';
import Post from '../models/post.model'; // O modelo ajustado para Sequelize
import User from '../models/user.model'; // Modelo de usuários para associações
import auth from '../middleware/auth.middleware';
import authRole from '../middleware/authRole.middleware';
import { Op } from 'sequelize';

const router = Router();

router.post('/', auth, authRole('professor'), async (req: Request, res: Response) => {
  const { title, description, themeId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  // Certifique-se de que o userId está presente e é do tipo correto
  const userId = Number(req.userId); // Converte o userId para número

  if (isNaN(userId)) { // Verifica se o userId é um número válido
    return res.status(400).json({ message: 'ID de usuário inválido' });
  }

  const userName = req.userName;

  try {
    const newPost = await Post.create({
      title,
      description,
      themeId,
      userName, // Passa o userName correto
      userId,   // Passa o userId convertido para número
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o post', error });
  }
});


// GET /posts - Lista de posts com paginação e informações de criação/edição
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await Post.findAndCountAll({
      limit,
      offset,
      include: [
        { model: User, as: 'creator', attributes: ['username'] }, // Inclui quem criou
        { model: User, as: 'editor', attributes: ['username'] },  // Inclui quem editou
      ],
    });

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      totalPosts: count,
      posts,
    });
  } catch (error) {
    console.error('Erro ao listar os posts:', error);
    res.status(500).json({ message: 'Erro ao listar os posts', error });
  }
});

// GET /posts/search - Busca de posts por palavra-chave
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: 'Parâmetro de busca não fornecido' });
  }

  try {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } }, // Usando iLike para case insensitive
          { description: { [Op.iLike]: `%${query}%` } }
        ],
      },
      include: [
        { model: User, as: 'creator', attributes: ['username'] }, // Inclui quem criou
        { model: User, as: 'editor', attributes: ['username'] },  // Inclui quem editou
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar os posts:', error);
    res.status(500).json({ message: 'Erro ao buscar os posts', error });
  }
});

// GET /posts/:id - Leitura de um post específico com informações de criação/edição
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['username'] }, // Inclui quem criou
        { model: User, as: 'editor', attributes: ['username'] },  // Inclui quem editou
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Erro ao buscar o post:', error);
    res.status(500).json({ message: 'Erro ao buscar o post', error });
  }
});

// PUT /posts/:id - Atualização de postagens (Apenas professores)
router.put('/:id', auth, authRole('professor'), async (req: Request, res: Response) => {
  const { title, description, themeId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  try {
    const [updatedCount, [updatedPost]] = await Post.update(
      {
        title,
        description,
        themeId,
        modifyDate: new Date(),
        userName: req.userId, // Armazena o userId de quem editou o post
      },
      {
        where: { id: req.params.id },
        returning: true, // Retorna o post atualizado
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar o post:', error);
    res.status(500).json({ message: 'Erro ao atualizar o post', error });
  }
});

// DELETE /posts/:id - Exclusão de postagens (Apenas professores)
router.delete('/:id', auth, authRole('professor'), async (req: Request, res: Response) => {
  try {
    const deletedCount = await Post.destroy({
      where: { id: req.params.id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    res.status(200).json({ message: 'Post excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o post:', error);
    res.status(500).json({ message: 'Erro ao excluir o post', error });
  }
});

export default router;
