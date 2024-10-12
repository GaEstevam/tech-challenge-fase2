import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db'; // Supondo que você tenha um arquivo de configuração do Sequelize

// Interface para o User
interface IUser {
  id?: number; // Adicionando o id, que será a chave primária
  name: string;
  username: string;
  password: string;
  email: string;
  mobilePhone?: string;
  creation_Date?: Date;
  is_Active?: boolean;
  role: 'professor' | 'aluno';  // Campo para armazenar o papel
}

// Definindo o modelo User
class User extends Model<IUser> implements IUser {
  public id!: number;
  public name!: string;
  public username!: string;
  public password!: string;
  public email!: string;
  public mobilePhone?: string;
  public creation_Date!: Date;
  public is_Active!: boolean;
  public role!: 'professor' | 'aluno';

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializando o modelo User
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creation_Date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    is_Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM('professor', 'aluno'),
      allowNull: false,
    },
  },
  {
    sequelize, // Passando a instância do Sequelize
    tableName: 'users', // Nome da tabela no banco de dados
    modelName: 'User', // Nome do modelo
    schema: 'public',
  }
);

export enum Role {
  PROFESSOR = 'professor',
  STUDENT = 'student'
}

export default User;
