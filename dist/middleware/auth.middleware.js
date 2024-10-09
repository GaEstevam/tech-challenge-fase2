"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // Pega o header Authorization
    const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do header
    // Verifique se o token foi enviado
    if (!token) {
        console.log('Token não fornecido');
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    try {
        // Verifica o token JWT
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallbackSecret');
        // Verifica se `decoded` é do tipo `JwtPayload`
        if (typeof decoded === 'string') {
            console.log('Token inválido - String');
            return res.status(400).json({ message: 'Token inválido' });
        }
        // Verifica se o payload contém `id` e `role`
        const { id, role } = decoded;
        // Armazena o payload no `req.user`
        req.user = { id, role };
        console.log('Token válido, usuário autenticado:', req.user); // Adicione este log para verificar o token
        next(); // Passa para o próximo middleware ou rota
    }
    catch (error) {
        // Verifica se o erro é uma instância de Error e tem uma mensagem
        if (error instanceof Error) {
            console.log('Erro ao verificar o token:', error.message);
            return res.status(401).json({ message: 'Token inválido' });
        }
        else {
            console.log('Erro desconhecido ao verificar o token:', error);
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
};
exports.authMiddleware = authMiddleware;
