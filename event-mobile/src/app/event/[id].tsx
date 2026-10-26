import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { api, Evento, formatarData, Inscricao } from "../../services/api";
import { estilos } from "../../styles";

export default function DetalhesEvento() {
  const { id } = useLocalSearchParams<{ id: string }>(); // id do evento vindo da lista
  const { token } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [inscricaoId, setInscricaoId] = useState<string | null>(null); // null = não inscrito
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    setCarregando(true);
    try {
      // busca o evento e as inscrições do usuário ao mesmo tempo
      const [ev, inscricoes] = await Promise.all([
        api(`/api/events/${id}`),
        api("/api/registrations", { token }),
      ]);
      setEvento(ev);

      // já estou inscrito neste evento? guarda o id da inscrição (precisa dele p/ cancelar)
      const minha = (inscricoes as Inscricao[]).find((i) => i.eventId === id);
      setInscricaoId(minha ? minha.id : null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar o evento");
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [id, token])
  );

  // um botão só: se está inscrito cancela, se não está inscreve
  async function alternarInscricao() {
    setErro("");
    setSalvando(true);
    try {
      if (inscricaoId) {
        await api(`/api/registrations/${inscricaoId}`, { method: "DELETE", token });
        setInscricaoId(null);
      } else {
        const nova = await api(`/api/events/${id}/registrations`, { method: "POST", token });
        setInscricaoId(nova.id);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao atualizar a inscrição");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando && !evento) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!evento) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.erro}>{erro || "Evento não encontrado"}</Text>
        <Pressable style={[estilos.botao, { paddingHorizontal: 24 }]} onPress={carregar}>
          <Text style={estilos.botaoTexto}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: evento.imageUrl }} style={s.imagem} />

      <View style={{ padding: 16, gap: 8 }}>
        <Text style={s.titulo}>{evento.title}</Text>
        <Text style={s.info}>
          {formatarData(evento.date)} às {evento.time}
        </Text>
        <Text style={s.info}>{evento.location}</Text>
        <Text style={s.descricao}>{evento.description}</Text>

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable
          style={[estilos.botao, inscricaoId ? estilos.botaoVermelho : null]}
          onPress={alternarInscricao}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.botaoTexto}>{inscricaoId ? "Cancelar inscrição" : "Inscrever-se"}</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  imagem: { width: "100%", height: 220, backgroundColor: "#e2e8f0" },
  titulo: { fontSize: 24, fontWeight: "700" },
  info: { color: "#64748b", fontSize: 16 },
  descricao: { fontSize: 16, marginVertical: 8 },
});
