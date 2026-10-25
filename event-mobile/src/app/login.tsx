import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { estilos } from "@/styles";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro("");
    setCarregando(true);
    try {
      await login(email.trim(), senha); // logou? o layout troca de tela sozinho
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao entrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Plataforma de Eventos</Text>

      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      <Pressable
        style={[estilos.botao, carregando && estilos.botaoDesativado]}
        onPress={entrar}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.botaoTexto}>Entrar</Text>
        )}
      </Pressable>

      <Link href="/register" style={estilos.link}>
        Não tem conta? Cadastre-se
      </Link>
    </View>
  );
}
