import { Request, Response, NextFunction } from 'express';

// Middleware para verificar se o usuário tem a role específica
const authRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if (req.user.role !== role) {
      console.log(`Acesso negado. Role requerida: ${role}. Role do usuário: ${req.user.role}`);
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
    }

    next();  // Se o papel for compatível, passa para o próximo middleware ou rota
  };
};

export default authRole;
