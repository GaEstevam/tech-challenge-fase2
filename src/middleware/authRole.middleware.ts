// authRole.middleware.ts
import { Request, Response, NextFunction } from 'express';

const authRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
    }
    next();
  };
};

export default authRole;
