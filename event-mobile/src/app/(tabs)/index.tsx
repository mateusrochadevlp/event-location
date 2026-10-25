import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { api, Evento, formatarData } from "@/services/api";
import { estilos } from "@/styles";

export default function Eventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    setCarregando(true);
    try {
      setEventos(await api("/api/events"));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar os eventos");
    } finally {
      setCarregando(false);
    }
  }, []);

  // carrega toda vez que a aba aparece
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (carregando && eventos.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (erro && eventos.length === 0) {
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
      data={eventos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshing={carregando}
      onRefresh={carregar}
      ListHeaderComponent={erro ? <Text style={estilos.erro}>{erro}</Text> : undefined}
      ListEmptyComponent={<Text style={{ textAlign: "center" }}>Nenhum evento disponível.</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={s.card}
          onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
        >
          <Image source={{ uri: item.imageUrl }} style={s.imagem} />
          <View style={{ padding: 12, gap: 4 }}>
            <Text style={s.titulo}>{item.title}</Text>
            <Text style={s.info}>
              {formatarData(item.date)} às {item.time}
            </Text>
            <Text style={s.info}>{item.location}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", elevation: 2 },
  imagem: { width: "100%", height: 160, backgroundColor: "#e2e8f0" },
  titulo: { fontSize: 18, fontWeight: "700" },
  info: { color: "#64748b" },
});
