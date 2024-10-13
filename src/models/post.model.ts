import { Model, DataTypes, Optional } from 'sequelize';
import sequelize  from '../config/db'; 
import User from './user.model';


interface IPostAttributes {
  id?: number; 
  title: string;
  description: string;
  userId: number;  
  themeId?: number;  
  createdDate?: Date;
  modifyDate?: Date;
}


interface IPostCreationAttributes extends Optional<IPostAttributes, 'id' | 'createdDate' | 'modifyDate'> {}


enum Theme {
  CIENCIAS_EXATAS = 1,
  CIENCIAS_HUMANAS = 2,
  BIOLOGICAS = 3,
  MULTIDISCIPLINAR = 4,
}


class Post extends Model<IPostAttributes, IPostCreationAttributes> implements IPostAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public userId!: number;  
  public themeId?: number;
  public createdDate!: Date;
  public modifyDate!: Date;

  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    allowNull: false, 
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
  sequelize, 
  tableName: 'posts', 
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


Post.belongsTo(User, { as: 'creator', foreignKey: 'userId' });  
User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });      


export default Post;
