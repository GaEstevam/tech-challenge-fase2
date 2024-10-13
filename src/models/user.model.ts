import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db'; 


interface IUser {
  id?: number; 
  name: string;
  username: string;
  password: string;
  email: string;
  mobilePhone?: string;
  creation_Date?: Date;
  is_Active?: boolean;
  role: 'professor' | 'aluno';  
}

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

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    sequelize, 
    tableName: 'users', 
    modelName: 'User', 
    schema: 'public',
  }
);

export enum Role {
  PROFESSOR = 'professor',
  STUDENT = 'student'
}

export default User;
