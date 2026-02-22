# CNPJota 🔍

API SaaS para consulta de CNPJ com sistema de créditos, autenticação OAuth e cache inteligente.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-brightgreen)](https://www.prisma.io/)

## 📚 Documentação

- 📖 **[README.md](README.md)** - Você está aqui! Visão geral completa
- ⚡ **[QUICKSTART.md](QUICKSTART.md)** - Comece em 5 minutos
- 🛠️ **[SETUP.md](SETUP.md)** - Guia detalhado de configuração
- 💻 **[API_EXAMPLES.md](API_EXAMPLES.md)** - Exemplos de código em várias linguagens
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura e decisões técnicas
- 🚀 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy em produção (Vercel, AWS, Docker)
- ❓ **[FAQ.md](FAQ.md)** - Perguntas frequentes
- 🔒 **[SECURITY.md](SECURITY.md)** - Política de segurança
- 🤝 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Como contribuir
- 📝 **[CHANGELOG.md](CHANGELOG.md)** - Histórico de versões

## 🚀 Características

- ✅ **Autenticação OAuth** com Google e GitHub (NextAuth)
- ✅ **Sistema de Créditos** flexível e transparente
- ✅ **Cache Inteligente** - dados atualizados a cada 15 dias
- ✅ **Fallback Automático** entre 4 APIs de CNPJ:
  1. BrasilAPI (prioridade 1)
  2. OpenCNPJ (prioridade 2)
  3. CNPJá (prioridade 3)
  4. ReceitaWS (prioridade 4)
- ✅ **Rate Limiting** para garantir estabilidade
- ✅ **API Keys** seguras com hash
- ✅ **Dashboard Completo** para gerenciar créditos e API keys
- ✅ **Arquitetura Modular** - Controllers, Services, Repositories, DTOs
- ✅ **TypeScript** + **Next.js 15** + **Prisma** + **PostgreSQL**

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (recomendado: Supabase)
- Contas OAuth:
  - [Google Cloud Console](https://console.cloud.google.com/)
  - [GitHub OAuth Apps](https://github.com/settings/developers)

## 🛠️ Instalação

### 1. Clone e instale dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

Preencha as variáveis:

```env
# Database (Supabase)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-aleatorio-aqui"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="seu-github-client-id"
GITHUB_CLIENT_SECRET="seu-github-client-secret"

# Configurações
API_RATE_LIMIT_PER_SECOND=2
CNPJ_CACHE_DAYS=15
```

### 3. Configure OAuth

#### Google OAuth:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Vá em "APIs & Services" > "Credentials"
4. Crie "OAuth 2.0 Client ID"
5. Adicione URIs autorizados:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth:

1. Acesse [GitHub Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Configure:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. Configure o banco de dados

```bash
# Gera o Prisma Client
npx prisma generate

# Cria as tabelas
npx prisma db push

# Popula com dados iniciais (planos)
npx prisma db seed
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # NextAuth endpoints
│   │   └── v1/              # API v1
│   │       ├── cnpj/        # Consulta CNPJ
│   │       ├── api-keys/    # Gerenciar API keys
│   │       ├── credits/     # Gerenciar créditos
│   │       └── stats/       # Estatísticas
│   ├── dashboard/           # Dashboard do usuário
│   ├── login/               # Página de login
│   └── ...
├── components/              # Componentes React
│   └── ui/                  # shadcn/ui components
├── controllers/             # Controllers da API
├── services/                # Lógica de negócio
├── repositories/            # Acesso ao banco de dados
├── lib/                     # Utilitários e helpers
└── types/                   # Types e DTOs TypeScript

prisma/
├── schema.prisma           # Schema do banco
└── seed.ts                 # Dados iniciais
```

## 🔑 Como Usar a API

### 1. Faça Login

Acesse `/login` e autentique com Google ou GitHub.

### 2. Crie uma API Key

No dashboard, vá em "API Keys" e crie uma nova chave.

### 3. Faça Requisições

```bash
curl -X GET "http://localhost:3000/api/v1/cnpj/00000000000191" \
  -H "Authorization: Bearer sua-api-key-aqui"
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "cnpj": "00000000000191",
    "razaoSocial": "BANCO DO BRASIL S.A.",
    "nomeFantasia": "BANCO DO BRASIL",
    "cnae": "6422100",
    "descricaoCnae": "Bancos múltiplos, com carteira comercial",
    "endereco": {
      "logradouro": "SBS Quadra 1 Bloco A",
      "numero": "Lote 32",
      "bairro": "Asa Sul",
      "municipio": "Brasília",
      "uf": "DF",
      "cep": "70073901"
    },
    ...
  },
  "meta": {
    "timestamp": "2025-12-05T...",
    "creditCost": 0.33,
    "creditsRemaining": 99.67
  }
}
```

## 💳 Sistema de Créditos

### Como Funciona

Cada consulta consome **0.33 créditos**, independentemente da fonte de dados utilizada.

### Pontos Importantes

1. Cada consulta consome 0.33 créditos
2. Se dados estiverem em cache (< 15 dias), a consulta é mais rápida mas ainda consome créditos
3. Cache é atualizado automaticamente após 15 dias na próxima consulta
4. Novos usuários recebem **100 créditos de boas-vindas** (~300 consultas)
5. Créditos podem ser adicionados através do dashboard

### Adicionando Créditos

Acesse o dashboard e clique em "Adicionar Créditos" para visualizar os pacotes disponíveis.

## 🔒 Segurança

- ✅ API Keys com hash SHA-256
- ✅ Rate limiting por usuário
- ✅ Validação de CNPJ
- ✅ Autenticação via OAuth 2.0
- ✅ Proteção contra loops infinitos
- ✅ Timeout de 10s nas APIs externas

## 🗄️ Banco de Dados

### Principais Tabelas

- **User** - Usuários autenticados
- **CreditPack** - Pacotes de créditos disponíveis para compra
- **ApiKey** - Chaves de API
- **Credit** - Histórico de créditos
- **Transaction** - Transações de compra de créditos
- **CnpjData** - Cache de dados de CNPJ
- **CnpjQuery** - Log de consultas

### Comandos Úteis

```bash
# Ver banco no browser
npx prisma studio

# Criar migration
npx prisma migrate dev --name nome-da-migration

# Reset do banco (cuidado!)
npx prisma migrate reset
```

## 🎨 Frontend

- **Next.js 15** com App Router
- **Tailwind CSS** para estilização
- **shadcn/ui** - componentes UI
- **DaisyUI** - componentes adicionais
- **Lucide React** - ícones

## 📊 Monitoramento

O sistema registra:

- ✅ Todas consultas (sucesso/falha)
- ✅ Fonte dos dados (cache ou qual API)
- ✅ Custo em créditos
- ✅ Último uso de API keys
- ✅ Histórico de créditos

## 🚀 Deploy

### Vercel (Recomendado)

## 📝 Roadmap

Veja [CHANGELOG.md](CHANGELOG.md) para features planejadas:

- [ ] Melhorias no sistema de pagamento
- [ ] Webhooks para notificações
- [ ] Dashboard com gráficos de uso avançados
- [ ] API de consulta em lote
- [ ] Exportação de relatórios
- [ ] Testes automatizados
- [ ] SDK oficial JavaScript/Python

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

### Como Ajudar

- 🐛 Reportar bugs
- 💡 Sugerir features
- 📖 Melhorar documentação
- 🔧 Submeter pull requests
- ⭐ Dar uma estrela no GitHub!

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [BrasilAPI](https://brasilapi.com.br/) - API pública de dados do Brasil
- [OpenCNPJ](https://opencnpj.com/) - API open-source de CNPJ
- [CNPJá](https://cnpja.com/) - API gratuita de CNPJ
- [ReceitaWS](https://receitaws.com.br/) - API de consulta de CNPJ

## 📞 Contato

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/cnpjota/issues)
- **Email**: suporte@seu-dominio.com
- **Website**: https://seu-dominio.com

## 🌟 Estrelas no GitHub

Se este projeto foi útil para você, considere dar uma ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=seu-usuario/cnpjota&type=Date)](https://star-history.com/#seu-usuario/cnpjota&Date)

---

Desenvolvido com ❤️ usando Next.js, Prisma e TypeScript

**[⬆ Voltar ao topo](#cnpjota-)**

- [ ] Docker compose para desenvolvimento

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

Desenvolvido com ❤️ usando Next.js, Prisma e TypeScript
