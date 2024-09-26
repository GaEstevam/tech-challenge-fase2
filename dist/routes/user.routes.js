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
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
// Rota de registro de usuário
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, email, mobilePhone, role } = req.body;
    // Verificar se os campos obrigatórios estão presentes
    if (!name || !username || !password || !email || !role) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    try {
        // Verificar se o usuário já está registrado
        let user = yield user_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário já registrado.' });
        }
        // Criação de novo usuário com senha criptografada
        user = new user_model_1.default({
            name,
            username,
            password: yield bcryptjs_1.default.hash(password, 10), // Hash da senha
            email,
            mobilePhone, // Campo opcional
            role
        });
        // Salvar o usuário no banco de dados
        yield user.save();
        // Gerar o token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });
        // Responder com o token gerado
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error); // Log detalhado do erro
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
        // Verificar se o usuário existe
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }
        // Comparar a senha fornecida com a armazenada
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }
        // Gerar o token JWT com userId e role
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });
        // Responder com o token gerado
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error); // Log detalhado do erro
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
}));
exports.default = router;
