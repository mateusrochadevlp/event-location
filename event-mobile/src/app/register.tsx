import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { estilos } from "../styles";

export default function Cadastro() {
  const { register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro("");
    setCarregando(true);
    try {
      // a validação (nome, e-mail, senha de 6+) é feita pela API com zod,
      // e a mensagem de erro dela aparece aqui
      await register(nome.trim(), email.trim(), senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Criar conta</Text>

      <TextInput style={estilos.input} placeholder="Nome" value={nome} onChangeText={setNome} />
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
        placeholder="Senha (mínimo 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      <Pressable style={estilos.botao} onPress={cadastrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.botaoTexto}>Cadastrar</Text>}
      </Pressable>

      <Link href="/login" style={estilos.link}>
        Já tem conta? Entrar
      </Link>
    </View>
  );
}
