"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRole = (role) => {
    return (req, res, next) => {
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
exports.default = authRole;
