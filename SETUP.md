# SETUP.md - Guia de Configuração Rápida

## 🚀 Configuração Rápida

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados (Supabase)

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a "Connection String" (modo "URI")
5. Cole no `.env` em `DATABASE_URL`

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto (ex: "CNPJota")
3. Vá em "APIs & Services" > "Credentials"
4. Clique em "+ CREATE CREDENTIALS" > "OAuth 2.0 Client ID"
5. Configure:
   - Application type: **Web application**
   - Name: CNPJota Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
6. Copie o Client ID e Client Secret para o `.env`

### 4. Configurar GitHub OAuth

1. Acesse [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Preencha:
   - Application name: **CNPJota**
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Clique em "Register application"
5. Copie o Client ID
6. Clique em "Generate a new client secret"
7. Copie o Client Secret para o `.env`

### 5. Gerar NEXTAUTH_SECRET

```bash
# No PowerShell (Windows)
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

Ou use: https://generate-secret.vercel.app/32

Cole o resultado em `NEXTAUTH_SECRET` no `.env`

### 6. Arquivo .env Completo

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-gerado-acima"

# Google OAuth
GOOGLE_CLIENT_ID="1234567890-abc123def456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwx"

# GitHub OAuth
GITHUB_CLIENT_ID="Iv1.abcdef1234567890"
GITHUB_CLIENT_SECRET="abc123def456ghi789jkl012mno345pqr678stu"

# Configurações
API_RATE_LIMIT_PER_SECOND=2
CNPJ_CACHE_DAYS=15
ENCRYPTION_KEY="abcdefghijklmnopqrstuvwxyz123456"
```

### 7. Inicializar Banco de Dados

```bash
# Gera o Prisma Client
npx prisma generate

# Cria as tabelas no banco
npx prisma db push

# Popula com planos iniciais
npx prisma db seed
```

### 8. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Checklist de Verificação

- [ ] Dependências instaladas (`npm install`)
- [ ] Banco Supabase criado e `DATABASE_URL` configurada
- [ ] Google OAuth configurado (Client ID + Secret)
- [ ] GitHub OAuth configurado (Client ID + Secret)
- [ ] `NEXTAUTH_SECRET` gerado
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Tabelas criadas (`npx prisma db push`)
- [ ] Seed executado (`npx prisma db seed`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Login funcionando em http://localhost:3000/login

## 🐛 Troubleshooting

### Erro: "No DATABASE_URL"
→ Verifique se o `.env` existe e tem a variável `DATABASE_URL`

### Erro: "Invalid redirect URI"
→ Confira se as URLs de callback do Google/GitHub estão corretas

### Erro: "Prisma Client not generated"
→ Execute: `npx prisma generate`

### Erro ao fazer login
→ Verifique se o `NEXTAUTH_SECRET` está definido
→ Confira se as credenciais OAuth estão corretas

### Banco não conecta
→ Verifique se o IP está liberado no Supabase
→ Teste a connection string no Prisma Studio: `npx prisma studio`

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12)
2. Terminal onde o `npm run dev` está rodando
3. Logs do Supabase (Dashboard > Logs)

## 🎉 Próximos Passos

Após configurar:
1. Faça login em http://localhost:3000/login
2. Crie uma API Key no dashboard
3. Teste a API com o exemplo do README.md
