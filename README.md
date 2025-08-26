# San Remo – Sistema de Indicação

## Descrição

Este projeto é um sistema de indicação de imóveis para a imobiliária San Remo. Usuários podem indicar imóveis, acompanhar o status das indicações e receber comissões caso o negócio seja fechado. O sistema integra automações via n8n para notificações e outras ações.

---

## Funcionalidades Principais

- Cadastro e autenticação de usuários
- Formulário de indicação de imóveis
- Dashboard com acompanhamento de indicações e comissões
- Integração com Supabase (banco de dados e autenticação)
- Integração com n8n (webhook para automações)
- Notificações e feedback ao usuário

---

## Como Rodar o Projeto

1. **Pré-requisitos:**
   - Node.js 18+
   - Yarn ou npm
   - Conta no Supabase (configurada em `src/integrations/supabase/client.ts`)
   - Conta no n8n (opcional, para automações)

2. **Instalação:**
   ```bash
   # Instale as dependências
   npm install
   # ou
   yarn install
   ```

3. **Configuração:**
   - Configure as variáveis do Supabase em `src/integrations/supabase/client.ts`.
   - (Opcional) Configure a URL do webhook do n8n em `src/pages/ReferralForm.tsx`.

4. **Rodando o projeto:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   O sistema estará disponível em `http://localhost:5173` (ou porta definida pelo Vite).

---

## Estrutura de Pastas

- `src/pages/ReferralForm.tsx` – Formulário de indicação
- `src/pages/Dashboard.tsx` – Dashboard do usuário
- `src/integrations/supabase/` – Integração com Supabase
- `src/components/ui/` – Componentes reutilizáveis

---

## Observações

- O sistema exige autenticação para indicar imóveis.
- O envio para o n8n permite automações como envio de e-mails, notificações, etc.
- O projeto utiliza Tailwind CSS para estilização.

---

## Licença

MIT
