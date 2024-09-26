import { Request } from 'express';

// Extende a interface Request do Express
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;  // Adiciona a propriedade userId
    userRole?: string;  // Adiciona a propriedade userRole
  }
}
