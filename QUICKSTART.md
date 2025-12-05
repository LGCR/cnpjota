# ⚡ Quick Start - CNPJota

Comece em 5 minutos! 🚀

## 1️⃣ Clone e Instale

```bash
git clone https://github.com/seu-usuario/cnpjota.git
cd cnpjota
npm install
```

## 2️⃣ Configure o Banco (Supabase)

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Copie a Connection String
4. Cole no `.env`

## 3️⃣ Configure OAuth

### Google
1. [console.cloud.google.com](https://console.cloud.google.com)
2. Novo projeto → Credentials → OAuth 2.0
3. Redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub
1. [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

## 4️⃣ Arquivo .env

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rode: openssl rand -base64 32"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

## 5️⃣ Inicialize o Banco

```bash
npx prisma db push
npx prisma db seed
```

## 6️⃣ Execute

```bash
npm run dev
```

Acesse: **http://localhost:3000** 🎉

## ✅ Próximos Passos

1. Faça login (Google ou GitHub)
2. Crie uma API Key no dashboard
3. Teste a API:

```bash
curl http://localhost:3000/api/v1/cnpj/00000000000191 \
  -H "Authorization: Bearer sua-api-key"
```

## 📚 Documentação Completa

- [README.md](README.md) - Documentação completa
- [SETUP.md](SETUP.md) - Guia detalhado de setup
- [API_EXAMPLES.md](API_EXAMPLES.md) - Exemplos de uso da API
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura do sistema
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy em produção

## 🆘 Problemas?

- Confira [SETUP.md](SETUP.md#-troubleshooting)
- Abra uma [issue](https://github.com/seu-usuario/cnpjota/issues)

---

**Boa sorte! 🚀**
