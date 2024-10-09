"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const db_1 = require("./config/db"); // Usar import para consistência
// Removi a função connectDB, pois o sequelize.sync já conecta ao DB
// Cria a aplicação Express
const app = (0, express_1.default)();
// Middleware para lidar com CORS e parsing do body
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Rotas
app.use('/api/posts', post_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Sincronize o banco de dados e conecte ao PostgreSQL
db_1.sequelize.sync({ alter: true }) // Evite { force: true } em produção, pois apaga dados
    .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
})
    .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});
// Middleware para capturar erros
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Erro no servidor',
    });
});
exports.default = app;
