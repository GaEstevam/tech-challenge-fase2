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
const post_model_1 = __importDefault(require("../models/post.model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const authRole_middleware_1 = __importDefault(require("../middleware/authRole.middleware"));
require("./custom.d.ts");
const router = (0, express_1.Router)();
// POST /posts - Criação de postagens (Apenas professores)
router.post('/', auth_middleware_1.default, (0, authRole_middleware_1.default)('professor'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Dados recebidos para criar postagem:', req.body);
    const { title, description, themeId } = req.body;
    if (!title || !description) {
        console.log('Campos obrigatórios faltando na criação da postagem');
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    try {
        const newPost = new post_model_1.default({
            title,
            description,
            themeId,
            userName: req.userId // Certifique-se de que `req.userId` está sendo passado corretamente pelo middleware de autenticação
        });
        console.log('Nova postagem a ser salva:', newPost);
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error('Erro ao criar a postagem:', error);
        res.status(500).json({ message: 'Erro ao criar o post', error });
    }
}));
// GET /posts - Lista de posts com paginação
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [posts, total] = yield Promise.all([
            post_model_1.default.find().skip(skip).limit(limit),
            post_model_1.default.countDocuments()
        ]);
        res.status(200).json({
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            posts
        });
    }
    catch (error) {
        console.error('Erro ao listar os posts:', error);
        res.status(500).json({ message: 'Erro ao listar os posts', error });
    }
}));
// GET /posts/search - Busca de posts por palavra-chave
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ message: 'Parâmetro de busca não fornecido' });
    }
    try {
        const posts = yield post_model_1.default.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Erro ao buscar os posts:', error);
        res.status(500).json({ message: 'Erro ao buscar os posts', error });
    }
}));
// GET /posts/:id - Leitura de um post específico
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error('Erro ao buscar o post:', error);
        res.status(500).json({ message: 'Erro ao buscar o post', error });
    }
}));
// PUT /posts/:id - Atualização de postagens (Apenas professores)
router.put('/:id', auth_middleware_1.default, (0, authRole_middleware_1.default)('professor'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, themeId } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    try {
        const updatedPost = yield post_model_1.default.findByIdAndUpdate(req.params.id, { title, description, themeId, modifyDate: new Date() }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error('Erro ao atualizar o post:', error);
        res.status(500).json({ message: 'Erro ao atualizar o post', error });
    }
}));
// DELETE /posts/:id - Exclusão de postagens (Apenas professores)
router.delete('/:id', auth_middleware_1.default, (0, authRole_middleware_1.default)('professor'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield post_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.status(200).json({ message: 'Post excluído com sucesso' });
    }
    catch (error) {
        console.error('Erro ao excluir o post:', error);
        res.status(500).json({ message: 'Erro ao excluir o post', error });
    }
}));
exports.default = router;
