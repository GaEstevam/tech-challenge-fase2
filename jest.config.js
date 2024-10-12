module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],  // Carrega as variáveis de ambiente
  setupFilesAfterEnv: ['./setupTests.ts'],
};
