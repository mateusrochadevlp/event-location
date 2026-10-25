import { prisma } from "../../../../lib/prisma";
import { getUserFromRequest } from "../../../../lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Ctx) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;

  const registration = await prisma.registration.findUnique({ where: { id } });
  if (!registration) return Response.json({ error: "Inscrição não encontrada" }, { status: 404 });

  // só o dono da inscrição pode cancelar
  if (registration.userId !== user.id) {
    return Response.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.registration.delete({ where: { id } });
  return Response.json({ message: "Inscrição cancelada" });
}