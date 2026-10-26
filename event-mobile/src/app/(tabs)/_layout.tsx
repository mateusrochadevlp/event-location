import { Pressable, Text } from "react-native";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function TabsLayout() {
  const { logout } = useAuth();

  // botão "Sair" no canto do cabeçalho das duas abas
  const botaoSair = () => (
    <Pressable onPress={logout} style={{ marginRight: 16 }}>
      <Text style={{ color: "#dc2626", fontWeight: "600" }}>Sair</Text>
    </Pressable>
  );

  return (
    <Tabs screenOptions={{ headerRight: botaoSair }}>
      <Tabs.Screen name="index" options={{ title: "Eventos" }} />
      <Tabs.Screen name="registrations" options={{ title: "Minhas inscrições" }} />
    </Tabs>
  );
}
