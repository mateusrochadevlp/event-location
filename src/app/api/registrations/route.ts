import { prisma } from "../../../lib/prisma";
import { getUserFromRequest } from "../../../lib/auth";

export async function GET(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const registrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { event: true }, // traz o evento junto
    orderBy: { createdAt: "desc" },
  });

  return Response.json(registrations);
}