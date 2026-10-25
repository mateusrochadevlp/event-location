import { prisma } from "../../../../../lib/prisma";
import { getUserFromRequest } from "../../../../../lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id: eventId } = await params;

  // o evento existe?
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return Response.json({ error: "Evento não encontrado" }, { status: 404 });

  // já está inscrito? (o @@unique do schema também barraria, mas assim a mensagem fica melhor)
  const already = await prisma.registration.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });
  if (already) return Response.json({ error: "Você já está inscrito neste evento" }, { status: 409 });

  const registration = await prisma.registration.create({
    data: { userId: user.id, eventId },
  });

  return Response.json(registration, { status: 201 });
}