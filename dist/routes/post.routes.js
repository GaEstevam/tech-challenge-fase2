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
const post_model_1 = __importDefault(require("../models/post.model")); // Assumindo o caminho do modelo Post
const user_model_1 = __importDefault(require("../models/user.model")); // Assumindo o caminho do modelo User
const sequelize_1 = require("sequelize");
const auth_middleware_1 = require("../middleware/auth.middleware"); // Middleware para autenticação
const user_model_2 = require("../models/user.model"); // Enum para roles, onde há a role 'professor'
const router = (0, express_1.Router)();
// Middleware para verificar se o usuário é um professor
const isProfessor = (req, res, next) => {
    if (!req.user || req.user.role !== user_model_2.Role.PROFESSOR) {
        console.log('Acesso negado: Usuário não é professor');
        return res.status(403).json({ message: 'Acesso negado. Apenas professores podem criar ou editar posts.' });
    }
    next();
};
// Rota para criar um post
router.post('/create', auth_middleware_1.authMiddleware, isProfessor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, themeId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: 'Usuário não autenticado.' });
        }
        // Criação do post
        const post = yield post_model_1.default.create({
            title,
            description,
            themeId,
            userId,
        });
        // Envia a resposta e interrompe o fluxo aqui
        res.status(201).json(post);
        return; // Garante que a função encerra após enviar a resposta
    }
    catch (error) {
        // Logando o erro e retornando a resposta apenas uma vez
        if (!res.headersSent) {
            console.error('Erro ao criar o post:', error);
            return res.status(500).json({ message: 'Erro ao criar o post.', error });
        }
        else {
            console.error('Erro crítico: headers já enviados, mas erro detectado.', error);
        }
    }
}));
// Rota para editar um post
router.put('/edit/:id', auth_middleware_1.authMiddleware, isProfessor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, themeId } = req.body;
        const userId = req.user.id;
        // Encontra o post pelo ID e verifica se o criador é o usuário atual
        const post = yield post_model_1.default.findOne({ where: { id, userId } });
        if (!post) {
            console.log('Post não encontrado ou sem permissão para edição');
            return res.status(404).json({ message: 'Post não encontrado ou você não tem permissão para editá-lo.' });
        }
        // Atualiza o post
        post.title = title || post.title;
        post.description = description || post.description;
        post.themeId = themeId || post.themeId;
        yield post.save();
        console.log('Post editado com sucesso:', post);
        return res.status(200).json(post);
    }
    catch (error) {
        console.error('Erro ao editar o post:', error);
        return res.status(500).json({ message: 'Erro ao editar o post.', error });
    }
}));
// Rota para listar todos os posts com o nome do professor associado
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.findAll({
            include: [{
                    model: user_model_1.default,
                    as: 'creator',
                    attributes: ['username'], // Apenas o username do professor
                }]
        });
        console.log('Posts encontrados:', posts);
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error('Erro ao buscar os posts:', error);
        return res.status(500).json({ message: 'Erro ao buscar os posts.', error });
    }
}));
// Rota para buscar uma postagem específica por ID
router.get('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield post_model_1.default.findOne({
            where: { id },
            include: [{ model: user_model_1.default, as: 'creator', attributes: ['username'] }]
        });
        if (!post) {
            console.log('Postagem não encontrada');
            return res.status(404).json({ message: 'Postagem não encontrada.' });
        }
        console.log('Postagem encontrada:', post);
        return res.status(200).json(post);
    }
    catch (error) {
        console.error('Erro ao buscar a postagem:', error);
        return res.status(500).json({ message: 'Erro ao buscar a postagem.', error });
    }
}));
// Rota para pesquisar postagens pelo título
router.get('/search/:title', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.params;
    try {
        const posts = yield post_model_1.default.findAll({
            where: { title: { [sequelize_1.Op.like]: `%${title}%` } },
            include: [{ model: user_model_1.default, as: 'creator', attributes: ['username'] }]
        });
        if (posts.length === 0) {
            console.log('Nenhuma postagem encontrada com esse título');
            return res.status(404).json({ message: 'Nenhuma postagem encontrada com esse título.' });
        }
        console.log('Postagens encontradas:', posts);
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error('Erro ao pesquisar postagens:', error);
        return res.status(500).json({ message: 'Erro ao pesquisar postagens.', error });
    }
}));
// Rota para excluir uma postagem
router.delete('/delete/:id', auth_middleware_1.authMiddleware, isProfessor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const post = yield post_model_1.default.findOne({ where: { id, userId } });
        if (!post) {
            console.log('Post não encontrado ou sem permissão para exclusão');
            return res.status(404).json({ message: 'Post não encontrado ou você não tem permissão para excluí-lo.' });
        }
        yield post.destroy();
        console.log('Post excluído com sucesso');
        return res.status(200).json({ message: 'Postagem excluída com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao excluir a postagem:', error);
        return res.status(500).json({ message: 'Erro ao excluir a postagem.', error });
    }
}));
exports.default = router;
