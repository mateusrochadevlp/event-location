// troque pelo IP do seu PC na rede (veja com ipconfig). Celular e PC no mesmo Wi-Fi
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.7:3000";

export type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
};

export type Inscricao = {
  id: string;
  eventId: string;
  event: Evento;
};

// a data vem como 2026-11-10T00:00:00.000Z, mostra como 10/11/2026
export const formatarData = (data: string) =>
  data.slice(0, 10).split("-").reverse().join("/");

type Opcoes = { method?: string; body?: object; token?: string | null };

// todas as chamadas da API passam por aqui (fetch + token + tratamento de erro)
export async function api(caminho: string, opcoes: Opcoes = {}) {
  let res: Response;

  try {
    res = await fetch(API_URL + caminho, {
      method: opcoes.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
      },
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Confira a rede e o endereço.");
  }

  const dados = await res.json().catch(() => null);
  if (!res.ok) throw new Error(dados?.error ?? "Erro na requisição");
  return dados;
}
