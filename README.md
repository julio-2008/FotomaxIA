# CampanhaPronta AI

Gerador de campanhas de venda de alta conversão para pequenos negócios locais.

## Stack Técnica
- **Frontend**: React 19 + Tailwind CSS + Motion
- **Roteamento**: React Router Dom
- **Backend**: Express (Proxy para Gemini API)
- **IA**: Google Gemini 1.5 Flash (opcional) / Local Template Generator (fallback)
- **Persistência**: LocalStorage (Demo Mode) / Estrutura pronta para Supabase

## Como Rodar Localmente
1. Instale as dependências: `npm install`
2. Configure o `.env` (opcional): Adicione `GEMINI_API_KEY`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse: `http://localhost:3000`

## Modo Demo vs Produção
- **Demo**: Funciona totalmente via LocalStorage e templates inteligentes pré-definidos.
- **Produção**: Requer `GEMINI_API_KEY` para geração dinâmica e Banco de Dados (Supabase) para persistência em nuvem.

## Deploy
Este app está configurado para deploy em plataformas como Vercel, Netlify ou Cloud Run.
O script `npm run build` gera os estáticos e o `npm start` inicia o servidor Express servindo esses estáticos.
