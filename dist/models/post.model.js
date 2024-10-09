"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Assumindo que você tenha uma configuração do Sequelize
const user_model_1 = __importDefault(require("./user.model"));
// Definindo um enum para os temas
var Theme;
(function (Theme) {
    Theme[Theme["CIENCIAS_EXATAS"] = 1] = "CIENCIAS_EXATAS";
    Theme[Theme["CIENCIAS_HUMANAS"] = 2] = "CIENCIAS_HUMANAS";
    Theme[Theme["BIOLOGICAS"] = 3] = "BIOLOGICAS";
    Theme[Theme["MULTIDISCIPLINAR"] = 4] = "MULTIDISCIPLINAR";
})(Theme || (Theme = {}));
// Definindo o modelo Post com Sequelize
class Post extends sequelize_1.Model {
}
Post.init({
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    themeId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isIn: [[Theme.CIENCIAS_EXATAS, Theme.CIENCIAS_HUMANAS, Theme.BIOLOGICAS, Theme.MULTIDISCIPLINAR]],
        },
    },
    createdDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    modifyDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'posts',
    hooks: {
        beforeCreate: (post) => {
            post.createdDate = new Date();
            post.modifyDate = new Date();
        },
        beforeUpdate: (post) => {
            post.modifyDate = new Date();
        },
    },
});
// Definindo as associações
Post.belongsTo(user_model_1.default, { as: 'creator', foreignKey: 'userId' }); // Associa Post ao User pelo userId (criador)
user_model_1.default.hasMany(Post, { as: 'posts', foreignKey: 'userId' }); // User pode ter muitos Posts
// Exportando o modelo Post
exports.default = Post;
