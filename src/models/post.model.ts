import { Model, DataTypes, Optional } from 'sequelize'; 
import { sequelize } from '../config/db'; // Assumindo que você tenha uma configuração do Sequelize
import User from './user.model';

// Definindo a interface para tipagem do Post
interface IPostAttributes {
  id?: number; // ID pode ser opcional se for gerado automaticamente
  title: string;
  description: string;
  userId: number;  // Chave estrangeira para o User (associado pelo ID)
  themeId?: number;  // Número que representa o tema (1, 2, etc.)
  userName?: string; // Nome do usuário para exibição
  createdDate?: Date;
  modifyDate?: Date;
}

// Definindo a interface para incluir os atributos opcionais
interface IPostCreationAttributes extends Optional<IPostAttributes, 'id' | 'createdDate' | 'modifyDate' | 'userName'> {}

// Definindo um enum para os temas
enum Theme {
  CIENCIAS_EXATAS = 1,
  CIENCIAS_HUMANAS = 2,
  BIOLOGICAS = 3,
  MULTIDISCIPLINAR = 4,
}

// Definindo o modelo Post com Sequelize
class Post extends Model<IPostAttributes, IPostCreationAttributes> implements IPostAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public userId!: number;  // userId (chave estrangeira)
  public userName?: string; // Nome do usuário
  public themeId?: number;
  public createdDate!: Date;
  public modifyDate!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializando o modelo com a definição
Post.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // O userId é obrigatório para criar um Post
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'userName', // Este campo é opcional, apenas para exibição
  },
  themeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isIn: [[Theme.CIENCIAS_EXATAS, Theme.CIENCIAS_HUMANAS, Theme.BIOLOGICAS, Theme.MULTIDISCIPLINAR]],
    },
  },
  createdDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  modifyDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize, // A instância do Sequelize
  tableName: 'posts', // Nome da tabela
  hooks: {
    beforeCreate: (post: IPostAttributes) => {
      post.createdDate = new Date();
      post.modifyDate = new Date();
    },
    beforeUpdate: (post: IPostAttributes) => {
      post.modifyDate = new Date();
    },
  },
});

// Definindo as associações
Post.belongsTo(User, { as: 'creator', foreignKey: 'userId' });  // Associa Post ao User pelo userId (criador)
User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });      // User pode ter muitos Posts


// Exportando o modelo Post
export default Post;
