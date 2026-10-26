"use client"; // Permite usar estados e interações no navegador.

import { useState } from "react"; // Guarda valores que mudam na tela.
import { useRouter } from "next/navigation"; // Permite navegar entre páginas.

export default function LoginPage() {
  const router = useRouter(); // Controla a navegação.

  // Estados: valores que podem mudar durante o uso.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Impede o formulário de recarregar a página.
    setMensagem(""); // Limpa mensagens anteriores.
    setCarregando(true); // Indica que o login está sendo processado.

    try {
      // Envia e-mail e senha para a API de login - fetch faz requisição para api.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // dados serão enviados em json.
        body: JSON.stringify({ email, password: senha }), //transforma um valor JavaScript em uma string json.
      });

      const dados = await res.json(); // Lê a resposta da API.

      if (!res.ok) {
        setMensagem(dados.error || "Não foi possível entrar.");
      } else if (dados.user.role !== "ADMIN") {
        setMensagem("Sua conta não tem acesso ao painel.");
      } else {
        sessionStorage.setItem("token", dados.token); // Guarda o token.
        router.push("/admin"); // Abre o painel administrativo.
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false); // Encerra o carregamento.
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={entrar} className="flex w-full max-w-sm flex-col gap-3 rounded-xl bg-white p-6 shadow">
        <h1 className="text-center text-2xl font-semibold">
          Plataforma de Eventos
        </h1>

        {/* Campos de e-mail e senha */}
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="rounded border p-3" required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} className="rounded border p-3" required />

        <button disabled={carregando} className="rounded bg-blue-600 p-3 text-white disabled:opacity-60">
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        {/* Só aparece quando existe uma mensagem */}
        {mensagem && <p className="text-center text-sm text-red-600">{mensagem}</p>}
      </form>
    </main>
  );
}