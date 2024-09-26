import { Schema, model, Document } from 'mongoose';

// Definindo a interface para tipagem do Post
interface IPost extends Document {
  title: string;
  description: string;
  userName: string;
  themeId?: number;  // Número que representa o tema (1, 2, etc.)
  createdDate: Date;
  modifyDate: Date;
}

// Definindo um enum para os temas
enum Theme {
  CIENCIAS_EXATAS = 1,
  CIENCIAS_HUMANAS = 2,
  BIOLOGICAS = 3,
  MULTIDISCIPLINAR = 4
}

// Esquema do Post
const postSchema = new Schema<IPost>({
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
postSchema.pre<IPost>('save', function (next) {
  this.modifyDate = new Date();
  next();
});

// Exportando o modelo Post
const Post = model<IPost>('Post', postSchema);
export default Post;
