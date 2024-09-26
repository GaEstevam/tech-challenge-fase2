"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRole = (role) => {
    return (req, res, next) => {
        if (req.userRole !== role) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
        }
        next();
    };
};
exports.default = authRole;
