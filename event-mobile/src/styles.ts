import { StyleSheet } from "react-native";

// estilos que se repetem nas telas
export const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 20, justifyContent: "center", gap: 12, backgroundColor: "#f1f5f9" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 12 },
  titulo: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botao: { backgroundColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center" },
  botaoVermelho: { backgroundColor: "#dc2626" },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: "#fff", fontWeight: "600", fontSize: 16 },
  erro: { color: "#dc2626", textAlign: "center" },
  link: { color: "#2563eb", textAlign: "center", marginTop: 8 },
});
