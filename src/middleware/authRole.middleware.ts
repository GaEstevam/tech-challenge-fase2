import { Request, Response, NextFunction } from 'express';


const authRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if (req.user.role !== role) {
      console.log(`Acesso negado. Role requerida: ${role}. Role do usuário: ${req.user.role}`);
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
    }

    next();  
  };
};

export default authRole;
