// custom.d.ts
declare namespace Express {
  interface Request {
    user: { id: number, role: string }; // Ajuste conforme os dados do usuário
  }
}
