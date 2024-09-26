import { Router, Request, Response } from 'express';
import Post from '../models/post.model';
import auth from '../middleware/auth.middleware';
import authRole from '../middleware/authRole.middleware';

const router = Router();

// POST /posts - Criação de postagens (Apenas professores)
router.post('/', auth, authRole('professor'), async (req, res) => {
  console.log('Dados recebidos para criar postagem:', req.body);

  const { title, description, themeId } = req.body;

  if (!title || !description) {
    console.log('Campos obrigatórios faltando na criação da postagem');
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  try {
    const newPost = new Post({
      title,
      description,
      themeId,
      userName: req.userId
    });

    console.log('Nova postagem a ser salva:', newPost);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erro ao criar a postagem:', error);
    res.status(500).json({ message: 'Erro ao criar o post', error });
  }
});

// GET /posts - Lista de posts com paginação
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().skip(skip).limit(limit),
      Post.countDocuments()
    ]);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts
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
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar os posts:', error);
    res.status(500).json({ message: 'Erro ao buscar os posts', error });
  }
});

// GET /posts/:id - Leitura de um post específico
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
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
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, themeId, modifyDate: new Date() },
      { new: true }
    );
    if (!updatedPost) {
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
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.status(200).json({ message: 'Post excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o post:', error);
    res.status(500).json({ message: 'Erro ao excluir o post', error });
  }
});

export default router;
