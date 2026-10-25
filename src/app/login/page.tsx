"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      const dados = await res.json();

      if (!res.ok) {
        setMensagem(dados.error);
        return;
      }

      // só admin entra no painel
      if (dados.user.role !== "ADMIN") {
        setMensagem("Sua conta não tem acesso ao painel.");
        return;
      }

      sessionStorage.setItem("token", dados.token);
      router.push("/admin");
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={entrar} className="flex w-full max-w-sm flex-col gap-3 rounded-xl bg-white p-6 shadow">
        <h1 className="text-center text-2xl font-semibold">Plataforma de Eventos</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border p-3"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="rounded border p-3"
          required
        />

        <button disabled={carregando} className="rounded bg-blue-600 p-3 text-white disabled:opacity-60">
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        {mensagem && <p className="text-center text-sm text-red-600">{mensagem}</p>}
      </form>
    </main>
  );
}