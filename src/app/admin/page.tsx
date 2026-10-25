"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
};

const vazio = { title: "", description: "", date: "", time: "", location: "", imageUrl: "" };

const campo =
  "w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

// data vem como AAAA-MM-DD, mostra como dd/mm/aaaa
const formatar = (data: string) => data.slice(0, 10).split("-").reverse().join("/");

export default function AdminPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState(vazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      const res = await fetch("/api/events");
      setEventos(await res.json());
    } catch {
      setErro("Erro ao carregar os eventos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // sem token volta pro login
    if (!sessionStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    carregar();
  }, [router]);

  function mudar(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch(editandoId ? `/api/events/${editandoId}` : "/api/events", {
        method: editandoId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const dados = await res.json();

      if (!res.ok) {
        setErro(dados.error);
        return;
      }

      setForm(vazio);
      setEditandoId(null);
      carregar();
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  function editar(evento: Evento) {
    setEditandoId(evento.id);
    setForm({
      title: evento.title,
      description: evento.description,
      date: evento.date.slice(0, 10), // o input date quer AAAA-MM-DD
      time: evento.time,
      location: evento.location,
      imageUrl: evento.imageUrl,
    });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este evento?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      if (!res.ok) {
        const dados = await res.json();
        setErro(dados.error);
        return;
      }

      carregar();
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  function sair() {
    sessionStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600">PLATAFORMA DE EVENTOS</p>
            <h1 className="text-2xl font-semibold">Painel de eventos</h1>
          </div>
          <button onClick={sair} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200">
            Sair
          </button>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={salvar} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">{editandoId ? "Editar evento" : "Novo evento"}</h2>

            <input name="title" placeholder="Título" value={form.title} onChange={mudar} className={campo} required />
            <textarea name="description" placeholder="Descrição" rows={3} value={form.description} onChange={mudar} className={campo} required />

            <div className="grid grid-cols-2 gap-3">
              <input name="date" type="date" value={form.date} onChange={mudar} className={campo} required />
              <input name="time" type="time" value={form.time} onChange={mudar} className={campo} required />
            </div>

            <input name="location" placeholder="Local" value={form.location} onChange={mudar} className={campo} required />
            <input name="imageUrl" type="url" placeholder="URL da imagem" value={form.imageUrl} onChange={mudar} className={campo} required />

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <button className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
              {editandoId ? "Salvar alterações" : "Cadastrar evento"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={() => { setEditandoId(null); setForm(vazio); }}
                className="rounded-lg bg-slate-100 px-4 py-2.5 font-medium hover:bg-slate-200"
              >
                Cancelar
              </button>
            )}
          </form>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Seus eventos ({eventos.length})</h2>

            {carregando && <p>Carregando...</p>}
            {!carregando && eventos.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500">Nenhum evento cadastrado.</p>
            )}

            <ul className="grid gap-4 sm:grid-cols-2">
              {eventos.map((evento) => (
                <li key={evento.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <img src={evento.imageUrl} alt={evento.title} className="h-40 w-full object-cover" />

                  <div className="flex flex-col gap-1 p-4">
                    <strong className="text-lg">{evento.title}</strong>
                    <p className="text-sm text-slate-600">{evento.description}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatar(evento.date)} às {evento.time}
                    </p>
                    <p className="text-sm text-slate-500">{evento.location}</p>

                    <div className="mt-3 flex gap-2">
                      <button onClick={() => editar(evento)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">
                        Editar
                      </button>
                      <button onClick={() => excluir(evento.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100">
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}