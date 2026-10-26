import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

function Rotas() {
  const { token, carregando } = useAuth();

  // espera ler a sessão salva antes de decidir qual tela mostrar
  if (carregando) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <Stack>
      {/* Só existem para quem TEM token. Sem login, o Expo Router bloqueia. */}
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Detalhes do evento" }} />
      </Stack.Protected>

      {/* Só existem para quem NÃO tem token. */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="register" options={{ title: "Criar conta" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  // o Provider envolve tudo: qualquer tela pode usar useAuth()
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}
