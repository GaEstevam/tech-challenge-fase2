"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Definindo um enum para os temas
var Theme;
(function (Theme) {
    Theme[Theme["CIENCIAS_EXATAS"] = 1] = "CIENCIAS_EXATAS";
    Theme[Theme["CIENCIAS_HUMANAS"] = 2] = "CIENCIAS_HUMANAS";
    Theme[Theme["BIOLOGICAS"] = 3] = "BIOLOGICAS";
    Theme[Theme["MULTIDISCIPLINAR"] = 4] = "MULTIDISCIPLINAR";
})(Theme || (Theme = {}));
// Esquema do Post
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userName: { type: String, required: true },
    themeId: {
        type: Number,
        enum: [Theme.CIENCIAS_EXATAS, Theme.CIENCIAS_HUMANAS, Theme.BIOLOGICAS, Theme.MULTIDISCIPLINAR],
        required: false
    },
    createdDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
});
// Atualiza a data de modificação antes de salvar
postSchema.pre('save', function (next) {
    this.modifyDate = new Date();
    next();
});
// Exportando o modelo Post
const Post = (0, mongoose_1.model)('Post', postSchema);
exports.default = Post;
