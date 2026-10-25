import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function Rotas() {
  const { token, carregando } = useAuth();

  // espera recuperar a sessão antes de decidir qual tela mostrar
  if (carregando) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <Stack>
      {/* telas que exigem login */}
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Detalhes do evento" }} />
      </Stack.Protected>

      {/* telas só para quem não está logado */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="register" options={{ title: "Criar conta" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}
