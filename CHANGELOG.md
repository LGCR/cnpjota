# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-12-05

### ✨ Adicionado

#### Autenticação
- Login via Google OAuth
- Login via GitHub OAuth
- Sistema de sessões com NextAuth v5
- Middleware de autenticação

#### API
- Endpoint `/api/v1/cnpj/[cnpj]` para consulta de CNPJ
- Endpoint `/api/v1/stats` para estatísticas do usuário
- Endpoint `/api/v1/api-keys` para gerenciamento de chaves
- Endpoint `/api/v1/credits` para gerenciamento de créditos

#### Integração com APIs Externas
- BrasilAPI (prioridade 1)
- OpenCNPJ (prioridade 2)
- CNPJá (prioridade 3)
- ReceitaWS (prioridade 4)
- Sistema de fallback automático entre APIs

#### Sistema de Créditos
- 3 planos: Básico, Profissional e Empresarial
- Custo variável por consulta baseado no plano
- Bônus de 100 créditos para novos usuários
- Histórico completo de transações

#### Cache
- Cache inteligente de dados de CNPJ
- Atualização automática a cada 15 dias
- Otimização para reduzir chamadas externas

#### Rate Limiting
- Limite de requisições por segundo baseado no plano
- Proteção contra loops infinitos
- Identificação e bloqueio de abusos

#### Dashboard
- Painel com estatísticas de uso
- Gerenciamento de API keys
- Visualização de créditos disponíveis
- Histórico de consultas
- Exemplos de integração em múltiplas linguagens
- Interface para adicionar créditos

#### Banco de Dados
- Schema Prisma completo
- Tabelas: User, Plan, ApiKey, Credit, CnpjData, CnpjQuery
- Índices otimizados para performance
- Seed com planos iniciais

#### Segurança
- API Keys com hash SHA-256
- Validação de CNPJ
- Headers de segurança HTTP
- Proteção CSRF
- Rate limiting por usuário

#### Documentação
- README.md completo
- QUICKSTART.md para início rápido
- SETUP.md com guia detalhado
- API_EXAMPLES.md com exemplos de código
- ARCHITECTURE.md com detalhes técnicos
- DEPLOYMENT.md para produção
- CONTRIBUTING.md para contribuidores

#### DevOps
- Scripts de teste da API
- Script para adicionar créditos manualmente
- Configuração VSCode
- Docker support
- GitHub Actions ready

### 🎨 Interface
- Design moderno com Tailwind CSS
- Componentes shadcn/ui + DaisyUI
- Modo claro/escuro
- Responsivo para mobile
- Ícones Lucide React

### 🔧 Infraestrutura
- Next.js 15 com App Router
- TypeScript em todo o projeto
- Prisma ORM
- PostgreSQL (Supabase)
- Arquitetura em camadas (Controller, Service, Repository)

---

## [Unreleased]

### 🚧 Planejado

#### Features
- [ ] Sistema de pagamento (Stripe/Mercado Pago)
- [ ] Webhooks para notificações
- [ ] Dashboard com gráficos de uso (Chart.js)
- [ ] Consulta em lote (batch)
- [ ] Exportação de relatórios (CSV/PDF)
- [ ] Notificações por email
- [ ] Sistema de referral/afiliados
- [ ] API v2 com GraphQL

#### Melhorias
- [ ] Cache com Redis
- [ ] Filas com Bull/BullMQ
- [ ] Testes automatizados (Jest, Playwright)
- [ ] Logs estruturados
- [ ] Monitoramento (Sentry, Datadog)
- [ ] CDN para cache de consultas frequentes

#### Documentação
- [ ] OpenAPI/Swagger
- [ ] Postman Collection
- [ ] Video tutoriais

---

## Como Ler Este Changelog

### Tipos de Mudanças

- **✨ Adicionado** - Novas features
- **🔄 Modificado** - Mudanças em features existentes
- **⚠️ Deprecated** - Features que serão removidas
- **❌ Removido** - Features removidas
- **🐛 Corrigido** - Bug fixes
- **🔒 Segurança** - Correções de vulnerabilidades

### Semantic Versioning

- **MAJOR** (X.0.0) - Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs compatíveis

---

Para histórico completo de commits, veja: [GitHub Commits](https://github.com/seu-usuario/cnpjota/commits/main)
