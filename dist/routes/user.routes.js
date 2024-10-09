"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model")); // Assumindo o caminho do modelo User
const auth_middleware_1 = require("../middleware/auth.middleware"); // Middleware de autenticação para rotas protegidas
const router = (0, express_1.Router)();
// Rota de registro de usuário
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, email, mobilePhone, role } = req.body;
    if (!name || !username || !password || !email || !role) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    try {
        let user = yield user_model_1.default.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Usuário já registrado.' });
        }
        user = yield user_model_1.default.create({
            name,
            username,
            password: yield bcryptjs_1.default.hash(password, 10),
            email,
            mobilePhone,
            role
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'minhaChaveSecretaSuperSegura', // Mesma chave secreta
        { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar o usuário', error });
    }
}));
// Rota de login de usuário
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    try {
        const user = yield user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'minhaChaveSecretaSuperSegura', // Mesma chave secreta
        { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
}));
// Rota para obter todos os usuários (apenas para administradores ou professores)
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
}));
// Rota para obter um único usuário por ID
router.get('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_model_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o usuário', error });
    }
}));
// Rota para atualizar um usuário
router.put('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, username, email, mobilePhone, is_Active, role } = req.body;
    try {
        let user = yield user_model_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.mobilePhone = mobilePhone || user.mobilePhone;
        user.is_Active = is_Active !== undefined ? is_Active : user.is_Active;
        user.role = role || user.role;
        yield user.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o usuário', error });
    }
}));
// Rota para deletar um usuário
router.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_model_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        yield user.destroy();
        res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir o usuário', error });
    }
}));
exports.default = router;
