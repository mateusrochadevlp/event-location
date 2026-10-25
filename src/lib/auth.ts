import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export function createToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "7d" });
}

// pega o token do header "Authorization: Bearer xxx" e devolve o usuário (ou null)
export function getUserFromRequest(req: Request) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  try {
    return jwt.verify(header.slice(7), secret) as { id: string; role: string };
  } catch {
    return null; // token inválido ou expirado
  }
}