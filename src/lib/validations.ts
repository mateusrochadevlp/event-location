import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  description: z.string().min(1, "Informe a descrição"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário deve estar no formato HH:MM"),
  location: z.string().min(1, "Informe o local"),
  imageUrl: z.string().url("URL da imagem inválida"),
});