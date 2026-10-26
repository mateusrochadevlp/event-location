
"use client";

// Importa os recursos para controlar estados, executar efeitos e navegar entre páginas.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define os campos e os tipos de dados de um evento.
type Evento = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
};

// Define os valores iniciais para limpar ou reiniciar o formulário.
const vazio = {
  title: "", description: "", date: "", time: "", location: "", imageUrl: "",
};

// Guarda as classes Tailwind usadas para estilizar os campos do formulário.
const campo =
  "w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

// Converte a data de AAAA-MM-DD para DD/MM/AAAA.
const formatar = (data: string) =>
  data.slice(0, 10).split("-").reverse().join("/");

export default function AdminPage() {
  // Permite navegar para outras páginas.
  const router = useRouter();

  // Guarda os eventos recebidos da API.
  const [eventos, setEventos] = useState<Evento[]>([]);

  // Guarda os valores digitados nos campos do formulário.
  const [form, setForm] = useState(vazio);

  // Guarda o ID do evento editado ou null quando nenhum está sendo editado.
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Guarda mensagens de erro para exibir na tela.
  const [erro, setErro] = useState("");

  // Indica se a lista de eventos ainda está carregando.
  const [carregando, setCarregando] = useState(true);

  // Busca os eventos na API e atualiza a lista exibida.
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

  // Verifica se existe token e carrega os eventos ao abrir a página.
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    carregar();
  }, [router]);

  // Guarda o valor digitado no campo correspondente sem apagar os outros.
  function mudar(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Limpa os campos e encerra o modo de edição.
  function limparForm() {
    setForm(vazio);
    setEditandoId(null);
  }

  // Envia os dados para criar um evento ou atualizar um existente.
  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch(
        editandoId ? `/api/events/${editandoId}` : "/api/events",
        {
          // Usa PUT para editar e POST para cadastrar.
          method: editandoId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          // Converte os dados do formulário para JSON.
          body: JSON.stringify(form),
        }
      );

      // Lê a resposta enviada pela API.
      const dados = await res.json();

      // Exibe o erro caso a API não aceite a operação.
      if (!res.ok) {
        setErro(dados.error);
        return;
      }

      // Limpa o formulário e atualiza a lista de eventos.
      limparForm();
      carregar();
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  // Preenche o formulário com os dados do evento selecionado.
  function editar(evento: Evento) {
    setEditandoId(evento.id);
    setForm({
      title: evento.title,
      description: evento.description,
      date: evento.date.slice(0, 10),
      time: evento.time,
      location: evento.location,
      imageUrl: evento.imageUrl,
    });
  }

  // Exclui um evento após a confirmação do usuário.
  async function excluir(id: string) {
    if (!confirm("Excluir este evento?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      // Exibe o erro se a API não conseguir excluir o evento.
      if (!res.ok) {
        setErro((await res.json()).error);
        return;
      }

      // Atualiza a lista após a exclusão.
      carregar();
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  // Remove o token da sessão e redireciona para o login.
  function sair() {
    sessionStorage.removeItem("token");
    router.replace("/login");
  }

  // Monta a interface visual do painel administrativo.
  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Cabeçalho com o nome do painel e o botão de saída. */}
        <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600">
              PLATAFORMA DE EVENTOS
            </p>
            <h1 className="text-2xl font-semibold">Painel de eventos</h1>
          </div>
          <button onClick={sair} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200">
            Sair
          </button>
        </header>

        {/* Divide a tela entre o formulário e a lista de eventos. */}
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          {/* Executa salvar quando o formulário é enviado. */}
          <form onSubmit={salvar} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">
              {editandoId ? "Editar evento" : "Novo evento"}
            </h2>

            {/* Cada campo usa mudar para atualizar os dados do formulário. */}
            <input name="title" placeholder="Título" value={form.title} onChange={mudar} className={campo} required />
            <textarea name="description" placeholder="Descrição" rows={3} value={form.description} onChange={mudar} className={campo} required />

            {/* Organiza os campos de data e horário lado a lado. */}
            <div className="grid grid-cols-2 gap-3">
              <input name="date" type="date" value={form.date} onChange={mudar} className={campo} required />
              <input name="time" type="time" value={form.time} onChange={mudar} className={campo} required />
            </div>

            {/* Recebe o local e o endereço da imagem do evento. */}
            <input name="location" placeholder="Local" value={form.location} onChange={mudar} className={campo} required />
            <input name="imageUrl" type="url" placeholder="URL da imagem" value={form.imageUrl} onChange={mudar} className={campo} required />

            {/* Mostra a mensagem de erro somente quando existe uma. */}
            {erro && <p className="text-sm text-red-600">{erro}</p>}

            {/* Altera o texto do botão conforme o modo do formulário. */}
            <button className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
              {editandoId ? "Salvar alterações" : "Cadastrar evento"}
            </button>

            {/* Mostra o botão cancelar somente durante uma edição. */}
            {editandoId && (
              <button type="button" onClick={limparForm} className="rounded-lg bg-slate-100 px-4 py-2.5 font-medium hover:bg-slate-200">
                Cancelar
              </button>
            )}
          </form>

          {/* Exibe o título da lista e a quantidade de eventos. */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Seus eventos ({eventos.length})
            </h2>

            {/* Informa que a API ainda está sendo consultada. */}
            {carregando && <p>Carregando...</p>}

            {/* Exibe uma mensagem quando não há eventos cadastrados. */}
            {!carregando && eventos.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500">
                Nenhum evento cadastrado.
              </p>
            )}

            {/* Percorre a lista e cria um cartão para cada evento. */}
            <ul className="grid gap-4 sm:grid-cols-2">
              {eventos.map(evento => (
                <li key={evento.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {/* Exibe a imagem e usa o título como texto alternativo. */}
                  <img src={evento.imageUrl} alt={evento.title} className="h-40 w-full object-cover" />

                  <div className="flex flex-col gap-1 p-4">
                    <strong className="text-lg">{evento.title}</strong>
                    <p className="text-sm text-slate-600">{evento.description}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatar(evento.date)} às {evento.time}
                    </p>
                    <p className="text-sm text-slate-500">{evento.location}</p>

                    {/* Os botões chamam as funções de editar e excluir. */}
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
