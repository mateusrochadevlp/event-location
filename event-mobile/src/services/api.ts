import Constants from "expo-constants";

// O Expo sabe o IP do PC que roda o "expo start" (ex: 192.168.0.7:8081).
// Pegamos só o IP e trocamos a porta por 3000, onde roda o Next.
// Assim funciona no celular e em qualquer máquina, sem escrever IP na mão.
const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${host}:3000`;

export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
};

export type Inscricao = { id: string; eventId: string; event: Evento };

// a API manda "2026-11-10T00:00:00.000Z", mostramos "10/11/2026"
export const formatarData = (data: string) =>
  data.slice(0, 10).split("-").reverse().join("/");

type Opcoes = { method?: string; body?: object; token?: string | null };

// TODA chamada à API passa por aqui: fetch + token + tratamento de erro
export async function api(caminho: string, opcoes: Opcoes = {}) {
  let res: Response;

  try {
    res = await fetch(API_URL + caminho, {
      method: opcoes.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        // se tem token, manda no header (é assim que a API sabe quem é o usuário)
        ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
      },
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
    });
  } catch {
    // fetch só dá erro aqui quando não chegou no servidor (rede, IP errado, CORS)
    throw new Error(`Não foi possível conectar à API (${API_URL})`);
  }

  const dados = await res.json().catch(() => null);

  // a API responde { error: "mensagem" } quando algo dá errado
  if (!res.ok) throw new Error(dados?.error ?? "Erro na requisição");
  return dados;
}
