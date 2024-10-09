# Utilizando uma imagem oficial do Node.js
FROM node:16

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando o package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o restante da aplicação
COPY . .

# Expondo a porta em que a aplicação vai rodar
EXPOSE 3000

# Definindo o comando padrão para rodar o servidor
CMD ["npm", "run", "dev"]
