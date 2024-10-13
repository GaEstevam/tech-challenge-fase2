import express, { Request, Response, Router } from 'express';
import Post from '../models/post.model'; 
import User from '../models/user.model'; 
import { Op } from 'sequelize'; 
import { authMiddleware } from '../middleware/auth.middleware'; 
import { Role } from '../models/user.model'; 

const router = Router();


const isProfessor = (req: Request, res: Response, next: Function) => {
  if (!req.user || req.user.role !== Role.PROFESSOR) {
    console.log('Acesso negado: Usuário não é professor');
    return res.status(403).json({ message: 'Acesso negado. Apenas professores podem criar ou editar posts.' });
  }
  next();
};


router.post('/create', authMiddleware, isProfessor, async (req: Request, res: Response) => {
  try {
    const { title, description, themeId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Usuário não autenticado.' });
    }

    
    const post = await Post.create({
      title,
      description,
      themeId,
      userId,
    });

    
    res.status(201).json(post);
    return;  
  } catch (error) {
    if (!res.headersSent) {
      console.error('Erro ao criar o post:', error);
      return res.status(500).json({ message: 'Erro ao criar o post.', error });
    } else {
      console.error('Erro crítico: headers já enviados, mas erro detectado.', error);
    }
  }
});


router.put('/edit/:id', authMiddleware, isProfessor, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, themeId } = req.body;
    const userId = req.user.id;

    
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      console.log('Post não encontrado ou sem permissão para edição');
      return res.status(404).json({ message: 'Post não encontrado ou você não tem permissão para editá-lo.' });
    }

    
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


router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username'], 
      }]
    });

    console.log('Posts encontrados:', posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar os posts:', error);
    return res.status(500).json({ message: 'Erro ao buscar os posts.', error });
  }
});


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


router.get('/search/:query', authMiddleware, async (req: Request, res: Response) => {
  const { query } = req.params;

  try {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{ model: User, as: 'creator', attributes: ['username'] }]
    });

    if (posts.length === 0) {
      console.log('Nenhuma postagem encontrada com o termo fornecido');
      return res.status(404).json({ message: 'Nenhuma postagem encontrada com o termo fornecido.' });
    }

    console.log('Postagens encontradas:', posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao pesquisar postagens:', error);
    return res.status(500).json({ message: 'Erro ao pesquisar postagens.', error });
  }
});

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
