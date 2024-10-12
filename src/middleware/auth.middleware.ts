import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;  
  const token = authHeader && authHeader.split(' ')[1];  

  
  if (!token) {
    console.log('Token não fornecido');
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecret');
  
    
    if (typeof decoded === 'string') {
      console.log('Token inválido - String');
      return res.status(400).json({ message: 'Token inválido' });
    }
  
    
    const { id, role } = decoded as JwtPayload & { id: number; role: string };
  
    
    req.user = { id, role };
  
    console.log('Token válido, usuário autenticado:', req.user);  
  
    next();  
  } catch (error) {
    
    if (error instanceof Error) {
      console.log('Erro ao verificar o token:', error.message);
      return res.status(401).json({ message: 'Token inválido' });
    } else {
      console.log('Erro desconhecido ao verificar o token:', error);
      return res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
};
