import { prisma } from "../../../../lib/prisma";
import { eventSchema } from "../../../../lib/validations";
import { getUserFromRequest } from "../../../../lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// detalhes de um evento (público)
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return Response.json({ error: "Evento não encontrado" }, { status: 404 });

  return Response.json(event);
}

// atualiza evento (só admin)
export async function PUT(req: Request, { params }: Ctx) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (user.role !== "ADMIN") return Response.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return Response.json({ error: "Evento não encontrado" }, { status: 404 });

  const event = await prisma.event.update({
    where: { id },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });

  return Response.json(event);
}

// exclui evento (só admin), as inscrições somem junto por causa do cascade
export async function DELETE(req: Request, { params }: Ctx) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (user.role !== "ADMIN") return Response.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;

  const exists = await prisma.event.findUnique({ where: { id } });
  if (!exists) return Response.json({ error: "Evento não encontrado" }, { status: 404 });

  await prisma.event.delete({ where: { id } });
  return Response.json({ message: "Evento excluído" });
}