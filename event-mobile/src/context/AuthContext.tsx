import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

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

// hook para qualquer tela pegar user, token, login...
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app: se tem sessão salva, o usuário continua logado.
  useEffect(() => {
    AsyncStorage.getItem("sessao")
      .then((salva) => {
        if (salva) {
          const dados = JSON.parse(salva);
          setToken(dados.token);
          setUser(dados.user);
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  // guarda na memória (estado) e no armazenamento do aparelho
  async function salvarSessao(dados: { token: string; user: Usuario }) {
    await AsyncStorage.setItem("sessao", JSON.stringify(dados));
    setToken(dados.token);
    setUser(dados.user);
  }

  async function login(email: string, password: string) {
    const dados = await api("/api/auth/login", { method: "POST", body: { email, password } });
    await salvarSessao(dados);
  }

  async function register(name: string, email: string, password: string) {
    const dados = await api("/api/auth/register", { method: "POST", body: { name, email, password } });
    await salvarSessao(dados); // cadastrou? já entra logado
  }

  async function logout() {
    await AsyncStorage.removeItem("sessao");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, carregando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
