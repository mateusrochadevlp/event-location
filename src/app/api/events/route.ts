import { prisma } from "../../../lib/prisma";
import { eventSchema } from "../../../lib/validations";
import { getUserFromRequest } from "../../../lib/auth";

// lista todos os eventos (público, o app usa na tela inicial)
export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return Response.json(events);
}

// cria evento (só admin)
export async function POST(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });
  if (user.role !== "ADMIN") return Response.json({ error: "Sem permissão" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date), // string vira Date pro Prisma
      creatorId: user.id,
    },
  });

  return Response.json(event, { status: 201 });
}