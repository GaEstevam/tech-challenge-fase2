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
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/posts', post_routes_1.default);
app.use('/api/users', user_routes_1.default);
db_1.default.sync({ alter: true })
    .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
})
    .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Erro no servidor',
    });
});
exports.default = app;
