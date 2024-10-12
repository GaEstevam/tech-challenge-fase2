import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'; // Assumindo o caminho do modelo User
import { authMiddleware } from '../middleware/auth.middleware'; // Middleware de autenticação para rotas protegidas

const router = Router();

// Rota de registro de usuário
router.post('/register', async (req: Request, res: Response) => {
  const { name, username, password, email, mobilePhone, role } = req.body;

  if (!name || !username || !password || !email || !role) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }
  console.log('Dados recebidos:', req.body);
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }

    user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10), // Criptografar a senha
      email,
      mobilePhone,
      role
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'Sua Senha', // Mesma chave secreta
      { expiresIn: '1h' }
    );
    

    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar o usuário', error });
  }
});

// Rota de login de usuário
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'Sua Senha', // Mesma chave secreta
      { expiresIn: '1h' }
    );
    

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

// Rota para obter todos os usuários (apenas para administradores ou professores)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
});

// Rota para obter um único usuário por ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o usuário', error });
  }
});

// Rota para atualizar um usuário
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, username, email, mobilePhone, is_Active, role } = req.body;

  try {
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.mobilePhone = mobilePhone || user.mobilePhone;
    user.is_Active = is_Active !== undefined ? is_Active : user.is_Active;
    user.role = role || user.role;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o usuário', error });
  }
});

// Rota para deletar um usuário
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir o usuário', error });
  }
});

export default router;
