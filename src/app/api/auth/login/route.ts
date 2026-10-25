import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { loginSchema } from "../../../../lib/validations";
import { createToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // mesma mensagem para email ou senha errados (não entrega qual dos dois falhou)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return Response.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }

  return Response.json({
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}