"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }
    try {
        const secretKey = process.env.JWT_SECRET || 'secret';
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.userId = decoded.userId; // Adiciona userId ao objeto req
        req.userRole = decoded.role; // Adiciona userRole ao objeto req
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};
exports.default = auth;
