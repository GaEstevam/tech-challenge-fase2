// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

// Extensão da interface Request para incluir os novos campos
declare module 'express' {
  interface Request {
    userId?: string;
    userRole?: string;
    userName?: string;
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Adicionando userId, userRole e userName ao request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userName = decoded.username;

    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

export default auth;
