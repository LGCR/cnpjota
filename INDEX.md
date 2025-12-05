# 📚 CNPJota - Índice de Documentação

Bem-vindo ao CNPJota! Este índice vai te guiar pela documentação completa do projeto.

## 🚀 Começando

**Primeira vez aqui?** Comece por aqui:

1. **[QUICKSTART.md](QUICKSTART.md)** ⚡ - Comece em 5 minutos
2. **[SETUP.md](SETUP.md)** 🛠️ - Guia detalhado de configuração
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** 📋 - Visão geral do projeto

## 📖 Documentação Principal

### Essencial
- **[README.md](README.md)** - Documentação completa do projeto
- **[FAQ.md](FAQ.md)** ❓ - Perguntas frequentes
- **[COMMANDS.md](COMMANDS.md)** 🛠️ - Comandos úteis para o dia a dia

### Desenvolvimento
- **[ARCHITECTURE.md](ARCHITECTURE.md)** 🏗️ - Arquitetura técnica e decisões
- **[API_EXAMPLES.md](API_EXAMPLES.md)** 💻 - Exemplos de uso da API
- **[CONTRIBUTING.md](CONTRIBUTING.md)** 🤝 - Como contribuir

### Deploy & Produção
- **[DEPLOYMENT.md](DEPLOYMENT.md)** 🚀 - Deploy em produção
- **[SECURITY.md](SECURITY.md)** 🔒 - Política de segurança

### Histórico
- **[CHANGELOG.md](CHANGELOG.md)** 📝 - Histórico de mudanças
- **[LICENSE](LICENSE)** 📄 - Licença MIT

## 🎯 Documentação por Caso de Uso

### "Quero começar agora mesmo!"
1. [QUICKSTART.md](QUICKSTART.md)
2. Execute: `npm run setup`
3. Configure `.env`
4. Execute: `npm run dev`

### "Quero entender como funciona"
1. [README.md](README.md) - Visão geral
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura
3. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumo completo

### "Quero usar a API"
1. [API_EXAMPLES.md](API_EXAMPLES.md) - Exemplos de código
2. [FAQ.md](FAQ.md) - Perguntas sobre a API
3. Dashboard → Criar API Key

### "Quero fazer deploy"
1. [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo
2. [SECURITY.md](SECURITY.md) - Checklist de segurança
3. [COMMANDS.md](COMMANDS.md#-deploy) - Comandos

### "Quero contribuir"
1. [CONTRIBUTING.md](CONTRIBUTING.md) - Guia de contribuição
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Entenda a arquitetura
3. [COMMANDS.md](COMMANDS.md) - Comandos úteis

## 📂 Estrutura de Arquivos

```
cnpjota/
├── 📘 Documentação
│   ├── README.md              # Documentação principal
│   ├── QUICKSTART.md          # Início rápido
│   ├── SETUP.md               # Setup detalhado
│   ├── API_EXAMPLES.md        # Exemplos de API
│   ├── ARCHITECTURE.md        # Arquitetura
│   ├── DEPLOYMENT.md          # Deploy
│   ├── FAQ.md                 # Perguntas frequentes
│   ├── SECURITY.md            # Segurança
│   ├── CONTRIBUTING.md        # Contribuições
│   ├── COMMANDS.md            # Comandos úteis
│   ├── CHANGELOG.md           # Histórico
│   ├── PROJECT_SUMMARY.md     # Resumo do projeto
│   ├── INDEX.md               # Este arquivo
│   └── LICENSE                # Licença MIT
│
├── 📁 Código Fonte
│   ├── src/                   # Código da aplicação
│   ├── prisma/                # Schema do banco
│   └── scripts/               # Scripts utilitários
│
├── ⚙️ Configuração
│   ├── package.json           # Dependências
│   ├── tsconfig.json          # TypeScript
│   ├── next.config.js         # Next.js
│   ├── tailwind.config.ts     # Tailwind
│   ├── .env.example           # Template de env
│   └── .env.local.example     # Template dev
│
└── 🔧 DevOps
    └── .vscode/               # Configuração VSCode
```

## 🔍 Encontre o que Precisa

### Por Tópico

#### Autenticação
- [SETUP.md#3-configure-oauth](SETUP.md#3-configure-oauth)
- [ARCHITECTURE.md#segurança](ARCHITECTURE.md#-segurança)
- [FAQ.md#api-keys](FAQ.md#-api-keys)

#### Créditos
- [README.md#sistema-de-créditos](README.md#-sistema-de-créditos)
- [FAQ.md#créditos-e-planos](FAQ.md#-créditos-e-planos)
- [COMMANDS.md#adicionar-créditos](COMMANDS.md#-testes)

#### API
- [API_EXAMPLES.md](API_EXAMPLES.md) - Exemplos completos
- [README.md#como-usar-a-api](README.md#-como-usar-a-api)
- [FAQ.md#consultas](FAQ.md#-consultas)

#### Deploy
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo
- [QUICKSTART.md](QUICKSTART.md) - Deploy rápido Vercel
- [SECURITY.md#checklist](SECURITY.md#-checklist-de-segurança-em-produção)

#### Troubleshooting
- [SETUP.md#troubleshooting](SETUP.md#-troubleshooting)
- [FAQ.md#problemas-comuns](FAQ.md#-problemas-comuns)
- [COMMANDS.md#troubleshooting](COMMANDS.md#-troubleshooting)

#### Desenvolvimento
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura completa
- [CONTRIBUTING.md](CONTRIBUTING.md) - Como contribuir
- [COMMANDS.md](COMMANDS.md) - Comandos úteis

## 📊 Fluxogramas

### Fluxo de Setup
```
1. Clone o projeto
   ↓
2. npm install
   ↓
3. Configure .env
   ↓
4. npx prisma db push
   ↓
5. npx prisma db seed
   ↓
6. npm run dev
   ↓
7. Acesse localhost:3000
```

### Fluxo de Uso
```
1. Fazer login (Google/GitHub)
   ↓
2. Criar API Key
   ↓
3. Fazer requisição HTTP
   ↓
4. Receber dados de CNPJ
```

## 🎓 Tutoriais Passo a Passo

1. **[Setup Completo](SETUP.md)** - Do zero ao primeiro login
2. **[Primeira Consulta](API_EXAMPLES.md#1-consultar-cnpj)** - Sua primeira chamada à API
3. **[Deploy na Vercel](DEPLOYMENT.md#-deploy-na-vercel-recomendado)** - Coloque online
4. **[Adicionar Créditos](COMMANDS.md#adicionar-créditos-manualmente)** - Gerencie créditos

## 🆘 Precisa de Ajuda?

1. **Procure no FAQ**: [FAQ.md](FAQ.md)
2. **Veja exemplos**: [API_EXAMPLES.md](API_EXAMPLES.md)
3. **Comandos úteis**: [COMMANDS.md](COMMANDS.md)
4. **Abra uma issue**: [GitHub Issues](https://github.com/seu-usuario/cnpjota/issues)

## 📞 Contatos

- **GitHub Issues**: Para bugs e features
- **Email**: suporte@seu-dominio.com
- **Segurança**: security@seu-dominio.com

## 🗺️ Roadmap

Veja [CHANGELOG.md](CHANGELOG.md) para features planejadas.

## ⭐ Projeto Útil?

Dê uma estrela no GitHub! ⭐

---

**Navegação Rápida:**
[🏠 Home](README.md) | 
[⚡ Quick Start](QUICKSTART.md) | 
[📖 Setup](SETUP.md) | 
[💻 API](API_EXAMPLES.md) | 
[🏗️ Arquitetura](ARCHITECTURE.md) | 
[🚀 Deploy](DEPLOYMENT.md)

**Última atualização**: 2025-12-05
