# DEPLOYMENT.md - Guia de Deploy em Produção

## 🚀 Deploy na Vercel (Recomendado)

### Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub
- Banco PostgreSQL (Supabase recomendado)

### Passo a Passo

#### 1. Prepare o Repositório

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/cnpjota.git
git push -u origin main
```

#### 2. Configure OAuth para Produção

**Google OAuth:**
1. No [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em Credentials > OAuth 2.0 Client ID
3. Adicione:
   - Authorized JavaScript origins: `https://seu-dominio.vercel.app`
   - Authorized redirect URIs: `https://seu-dominio.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
1. No [GitHub OAuth Apps](https://github.com/settings/developers)
2. Atualize:
   - Homepage URL: `https://seu-dominio.vercel.app`
   - Callback URL: `https://seu-dominio.vercel.app/api/auth/callback/github`

#### 3. Deploy no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório do GitHub
3. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-super-seguro-gerado
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
API_RATE_LIMIT_PER_SECOND=2
CNPJ_CACHE_DAYS=15
ENCRYPTION_KEY=...
```

4. Clique em "Deploy"

#### 4. Inicialize o Banco

Após o deploy, execute via terminal local:

```bash
# Configure DATABASE_URL no seu .env local
npx prisma db push
npx prisma db seed
```

#### 5. Teste

Acesse `https://seu-dominio.vercel.app` e faça login!

## 🐳 Deploy com Docker

### Dockerfile

Crie um `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/cnpjota
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cnpjota
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Build e Execute

```bash
# Build
docker-compose build

# Execute
docker-compose up -d

# Inicialize o banco
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

## ☁️ AWS (EC2 + RDS)

### Setup Básico

1. **RDS PostgreSQL**
   - Crie instância PostgreSQL no RDS
   - Configure Security Group (porta 5432)
   - Anote o endpoint

2. **EC2 Instance**
   - Lance instância Ubuntu 22.04
   - Configure Security Group (portas 80, 443, 22)

3. **Setup no EC2**

```bash
# Conecte via SSH
ssh -i sua-chave.pem ubuntu@ip-da-instancia

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instale PM2
sudo npm install -g pm2

# Clone o projeto
git clone https://github.com/seu-usuario/cnpjota.git
cd cnpjota

# Configure .env
nano .env

# Instale dependências
npm install

# Build
npm run build

# Configure banco
npx prisma db push
npx prisma db seed

# Inicie com PM2
pm2 start npm --name "cnpjota" -- start
pm2 save
pm2 startup
```

4. **Nginx como Proxy**

```bash
sudo apt install nginx

# Configure
sudo nano /etc/nginx/sites-available/cnpjota
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cnpjota /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **SSL com Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🔒 Checklist de Segurança em Produção

- [ ] `NEXTAUTH_SECRET` forte e único
- [ ] Variáveis de ambiente nunca commitadas
- [ ] HTTPS habilitado
- [ ] Rate limiting ativo
- [ ] Banco com senha forte
- [ ] Firewall configurado
- [ ] Logs monitorados
- [ ] Backups automáticos do banco
- [ ] CORS configurado corretamente
- [ ] Headers de segurança (CSP, HSTS, etc.)

## 📊 Monitoramento em Produção

### Vercel Analytics

Já incluído automaticamente no Vercel!

### Sentry (Erros)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Logs

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date() }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({ level: 'error', message, error, timestamp: new Date() }));
  }
};
```

## 🔄 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 💾 Backup do Banco de Dados

### Script de Backup Diário

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_URL="postgresql://user:pass@host:5432/db"

pg_dump $DB_URL > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Mantenha apenas backups dos últimos 30 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup concluído: backup_$DATE.sql.gz"
```

### Cron Job

```bash
crontab -e

# Adicione:
0 2 * * * /path/to/backup.sh
```

## 📈 Otimizações de Performance

### 1. Database Indexes

```sql
-- Já inclusos no schema, mas para referência:
CREATE INDEX idx_cnpj_query_user ON "CnpjQuery"("userId");
CREATE INDEX idx_cnpj_query_cnpj ON "CnpjQuery"("cnpj");
CREATE INDEX idx_cnpj_data_cnpj ON "CnpjData"("cnpj");
CREATE INDEX idx_api_key_key ON "ApiKey"("key");
```

### 2. Next.js Build Otimizações

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### 3. Caching Headers

```typescript
// app/api/v1/cnpj/[cnpj]/route.ts
export async function GET() {
  // ...
  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  });
}
```

## 🚨 Troubleshooting em Produção

### Logs do Vercel
```bash
vercel logs seu-projeto
```

### Verificar Saúde da API
```bash
curl https://seu-dominio.com/api/v1/stats \
  -H "Authorization: Bearer sua-api-key"
```

### Reiniciar PM2 (se usando EC2)
```bash
pm2 restart cnpjota
pm2 logs cnpjota
```

## 📞 Suporte Pós-Deploy

- Monitor de uptime: [UptimeRobot](https://uptimerobot.com/)
- Status page: [StatusPage.io](https://www.statuspage.io/)
- Alertas: Configure webhooks para Slack/Discord

---

**Parabéns! Seu CNPJota está em produção! 🎉**
