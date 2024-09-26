import { Schema, model, Document } from 'mongoose';

// Interface para o User
interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  mobilePhone?: string;
  external_Id?: string;
  creation_Date: Date;
  last_Login?: Date;
  is_Active: boolean;
  role: 'professor' | 'aluno';  // Novo campo para armazenar o papel
}

// Esquema do User
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobilePhone: { type: String },
  external_Id: { type: String },
  creation_Date: { type: Date, default: Date.now },
  last_Login: { type: Date },
  is_Active: { type: Boolean, default: true },
  role: { type: String, enum: ['professor', 'aluno'], required: true }  // Campo obrigatório para role
});

const User = model<IUser>('User', userSchema);
export default User;
