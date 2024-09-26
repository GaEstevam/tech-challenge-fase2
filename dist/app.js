"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
require("./custom.d.ts");
// Cria a aplicação Express
const app = (0, express_1.default)();
// Middleware para lidar com CORS e parsing do body
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Rotas
app.use('/api/posts', post_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tech-challenge';
mongoose_1.default.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Aumenta o tempo limite para selecionar o servidor
    socketTimeoutMS: 45000, // Aumenta o tempo limite do socket
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
// Middleware para capturar erros
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Erro no servidor',
    });
});
exports.default = app;
