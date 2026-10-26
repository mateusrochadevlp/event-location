# Plataforma de Eventos

Sistema web e API (Next.js) com PostgreSQL e Prisma. O app mobile fica em outro repositório/pasta.

## Requisitos
- Docker Desktop; Node e Npm

## Como executar
criar na raiz do projeto um .env com "DATABASE_URL" de acordo com o compose.yml e "JWT_SECRET" para criptografia.

```bash
npm install
copy .env.example .env
docker compose up -d
npx prisma migrate dev
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```
Acesse http://localhost:3000 (redireciona para o login).

## Acesso do administrador (criado pelo seed)
- E-mail: admin@eventos.com
- Senha: admin123

## Banco de dados
PostgreSQL via Docker (porta 5433). Models: User, Event e Registration, em `prisma/schema.prisma`. Migrations em `prisma/migrations`.

## Endpoints
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/events | Listar eventos |
| GET | /api/events/:id | Consultar evento |
| POST | /api/events | Criar evento (admin) |
| PUT | /api/events/:id | Atualizar evento (admin) |
| DELETE | /api/events/:id | Excluir evento (admin) |
| POST | /api/auth/register | Cadastrar usuário |
| POST | /api/auth/login | Login (retorna token JWT) |
| GET | /api/registrations | Inscrições do usuário |
| POST | /api/events/:id/registrations | Inscrever no evento |
| DELETE | /api/registrations/:id | Cancelar inscrição |

Rotas protegidas usam o header `Authorization: Bearer <token>`.

## Aplicativo mobile
