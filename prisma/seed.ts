import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventos.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@eventos.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  await prisma.event.create({
    data: {
      title: "Semana de Tecnologia",
      description: "Palestras e oficinas sobre desenvolvimento.",
      date: new Date("2026-11-10"),
      time: "19:00",
      location: "Auditório do IFMA Timon",
      imageUrl: "https://picsum.photos/600/400",
      creatorId: admin.id,
    },
  });
}

main().finally(() => prisma.$disconnect());