// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.userId = decoded.userId;  // Adiciona userId ao objeto req
    req.userRole = decoded.role;  // Adiciona userRole ao objeto req
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

export default auth;
