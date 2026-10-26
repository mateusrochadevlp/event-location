# Plataforma de Eventos - App Mobile

Aplicativo feito com React Native + Expo (Expo Router). Permite criar conta, fazer login, ver eventos, se inscrever e cancelar inscrições. Consome a API do projeto Next.js (`event-location`).

## Como rodar

1. Deixe a API rodando (projeto `event-location`, com o Docker ligado):

   ```bash
   npm run dev
   ```

2. Neste projeto, instale as dependências e inicie o app:

   ```bash
   npm install
   npx expo start
   ```

3. Abra o app:
   - **Celular**: instale o [Expo Go](https://expo.dev/go) e escaneie o QR code. O celular e o PC precisam estar na mesma rede Wi-Fi.
   - **Navegador**: aperte `w` no terminal.

## URL da API

O app descobre o IP do PC automaticamente e usa a porta 3000. Para usar outro endereço:

```bash
# PowerShell
$env:EXPO_PUBLIC_API_URL="http://SEU_IP:3000"; npx expo start -c
```

## Observações

- No navegador, a API precisa liberar CORS (já configurado no `next.config.ts` do `event-location`).
- Se o celular não conectar, libere a porta 3000 no firewall do Windows (rede privada).
- O código do app fica em `src/app` (telas), `src/context` (autenticação) e `src/services` (chamadas à API).