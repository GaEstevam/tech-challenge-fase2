import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const router = Router();

// Rota de registro de usuário
router.post('/register', async (req: Request, res: Response) => {
  const { name, username, password, email, mobilePhone, role } = req.body;

  // Verificar se os campos obrigatórios estão presentes
  if (!name || !username || !password || !email || !role) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  try {
    // Verificar se o usuário já está registrado
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }

    // Criação de novo usuário com senha criptografada
    user = new User({
      name,
      username,
      password: await bcrypt.hash(password, 10), // Hash da senha
      email,
      mobilePhone, // Campo opcional
      role
    });

    // Salvar o usuário no banco de dados
    await user.save();

    // Gerar o token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    // Responder com o token gerado
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error); // Log detalhado do erro
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
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Comparar a senha fornecida com a armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar o token JWT com userId e role
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    // Responder com o token gerado
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error); // Log detalhado do erro
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

export default router;
