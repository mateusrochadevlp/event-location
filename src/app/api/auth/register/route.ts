import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { registerSchema } from "../../../../lib/validations";
import { createToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // valida os dados com zod
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  // email já existe?
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return Response.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  // o role não vem do body, então ninguém vira ADMIN pelo cadastro (fica USER por padrão)
  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
  });

  return Response.json(
    {
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 201 }
  );
}