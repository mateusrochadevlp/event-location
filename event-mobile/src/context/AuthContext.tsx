import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/services/api";

type Usuario = { id: string; name: string; email: string; role: string };

type AuthContextType = {
  user: Usuario | null;
  token: string | null;
  carregando: boolean; // true enquanto recupera a sessão salva
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // ao abrir o app, tenta recuperar o login salvo no celular
  useEffect(() => {
    Promise.all([SecureStore.getItemAsync("token"), SecureStore.getItemAsync("user")])
      .then(([t, u]) => {
        if (t && u) {
          setToken(t);
          setUser(JSON.parse(u));
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function salvarSessao(dados: { token: string; user: Usuario }) {
    await SecureStore.setItemAsync("token", dados.token);
    await SecureStore.setItemAsync("user", JSON.stringify(dados.user));
    setToken(dados.token);
    setUser(dados.user);
  }

  async function login(email: string, password: string) {
    const dados = await api("/api/auth/login", { method: "POST", body: { email, password } });
    await salvarSessao(dados);
  }

  async function register(name: string, email: string, password: string) {
    const dados = await api("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    await salvarSessao(dados);
  }

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, carregando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
