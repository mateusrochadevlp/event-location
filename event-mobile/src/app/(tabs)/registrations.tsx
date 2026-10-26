import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { api, formatarData, Inscricao } from "../../services/api";
import { estilos } from "../../styles";

export default function MinhasInscricoes() {
  const { token } = useAuth();
  const [lista, setLista] = useState<Inscricao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    setCarregando(true);
    try {
      setLista(await api("/api/registrations", { token })); // já vem com o evento dentro
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar as inscrições");
    } finally {
      setCarregando(false);
    }
  }

  // recarrega ao abrir a aba (mostra inscrições feitas na tela de detalhes)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [token])
  );

  async function cancelar(id: string) {
    try {
      await api(`/api/registrations/${id}`, { method: "DELETE", token });
      setLista((atual) => atual.filter((i) => i.id !== id)); // tira da tela sem recarregar
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao cancelar");
    }
  }

  if (carregando && lista.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (erro && lista.length === 0) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.erro}>{erro}</Text>
        <Pressable style={[estilos.botao, { paddingHorizontal: 24 }]} onPress={carregar}>
          <Text style={estilos.botaoTexto}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={lista}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshing={carregando}
      onRefresh={carregar}
      ListHeaderComponent={erro ? <Text style={estilos.erro}>{erro}</Text> : undefined}
      ListEmptyComponent={<Text style={{ textAlign: "center" }}>Você ainda não tem inscrições.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Image source={{ uri: item.event.imageUrl }} style={s.imagem} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={s.titulo}>{item.event.title}</Text>
            <Text style={s.info}>
              {formatarData(item.event.date)} às {item.event.time}
            </Text>
            <Text style={s.info}>{item.event.location}</Text>
            <Pressable onPress={() => cancelar(item.id)}>
              <Text style={s.cancelar}>Cancelar inscrição</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { flexDirection: "row", gap: 12, backgroundColor: "#fff", borderRadius: 12, padding: 12, elevation: 2 },
  imagem: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#e2e8f0" },
  titulo: { fontSize: 16, fontWeight: "700" },
  info: { color: "#64748b" },
  cancelar: { color: "#dc2626", fontWeight: "600", marginTop: 6 },
});
