# 🛠️ Comandos Úteis - CNPJota

Referência rápida de comandos para desenvolvimento e manutenção.

## 📦 NPM / Dependências

```bash
# Instalar dependências
npm install

# Adicionar nova dependência
npm install nome-do-pacote

# Adicionar dependência de desenvolvimento
npm install -D nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Auditar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

## 🚀 Next.js

```bash
# Desenvolvimento (porta 3000)
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Lint
npm run lint

# Lint + fix
npm run lint -- --fix
```

## 🗄️ Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome-da-migration

# Aplicar migrations
npx prisma migrate deploy

# Reset do banco (CUIDADO!)
npx prisma migrate reset

# Push schema sem migration
npx prisma db push

# Seed (popular dados iniciais)
npx prisma db seed

# Abrir Prisma Studio (GUI)
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Pull schema do banco
npx prisma db pull
```

## 🔍 Git

```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem"

# Push
git push origin main

# Pull
git pull origin main

# Criar branch
git checkout -b nome-da-branch

# Mudar de branch
git checkout nome-da-branch

# Ver histórico
git log --oneline

# Ver diff
git diff

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer mudanças em arquivo
git checkout -- arquivo.txt
```

## 🐳 Docker

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Entrar no container
docker-compose exec app sh

# Rebuild completo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 🧪 Testes

```bash
# Testar API (após criar API key)
node scripts/test-api.js sua-api-key-aqui

# Adicionar créditos manualmente
node scripts/add-credits.js usuario@email.com 100

# Testar endpoint específico
curl http://localhost:3000/api/v1/cnpj/00000000000191 \
  -H "Authorization: Bearer sua-api-key"
```

## 🔧 Utilitários

```bash
# Verificar versão Node.js
node -v

# Verificar versão npm
npm -v

# Limpar cache npm
npm cache clean --force

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Gerar secret aleatório
openssl rand -base64 32

# Gerar hex aleatório
openssl rand -hex 16

# Ver portas em uso (Windows PowerShell)
netstat -ano | findstr :3000

# Matar processo na porta 3000 (PowerShell)
$processId = (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id $processId -Force
```

## 📊 Database

```bash
# Conectar ao PostgreSQL
psql postgresql://user:pass@host:5432/db

# Backup do banco
pg_dump postgresql://user:pass@host:5432/db > backup.sql

# Restaurar backup
psql postgresql://user:pass@host:5432/db < backup.sql

# Executar query
psql postgresql://user:pass@host:5432/db -c "SELECT * FROM \"User\";"
```

## 🔍 Queries SQL Úteis

```sql
-- Ver total de usuários
SELECT COUNT(*) FROM "User";

-- Ver total de créditos por usuário
SELECT 
  u.email,
  SUM(c.amount) as total_credits
FROM "User" u
LEFT JOIN "Credit" c ON c."userId" = u.id
GROUP BY u.id, u.email;

-- Top 10 CNPJs mais consultados
SELECT cnpj, COUNT(*) as total
FROM "CnpjQuery"
GROUP BY cnpj
ORDER BY total DESC
LIMIT 10;

-- Taxa de cache hit
SELECT 
  SUM(CASE WHEN source = 'cache' THEN 1 ELSE 0 END) as cache_hits,
  COUNT(*) as total,
  ROUND(SUM(CASE WHEN source = 'cache' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as hit_rate
FROM "CnpjQuery";

-- Usuários com mais consultas
SELECT 
  u.email,
  COUNT(q.id) as total_queries,
  SUM(q."creditCost") as total_spent
FROM "User" u
LEFT JOIN "CnpjQuery" q ON q."userId" = u.id
GROUP BY u.id, u.email
ORDER BY total_queries DESC
LIMIT 10;

-- Limpar dados antigos (cuidado!)
DELETE FROM "CnpjData"
WHERE "lastUpdatedAt" < NOW() - INTERVAL '90 days';
```

## 🚀 Deploy

```bash
# Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls
```

## 🔐 Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Editar (Windows)
notepad .env

# Editar (Linux/Mac)
nano .env

# Validar .env (certifique que todas variáveis estão definidas)
cat .env | grep -v "^#" | grep -v "^$"
```

## 📝 Logs

```bash
# Ver logs do Next.js (desenvolvimento)
# Logs aparecem no terminal onde rodou npm run dev

# Ver logs do Prisma
# Configurado em prisma/schema.prisma

# Logs de produção (Vercel)
vercel logs --follow

# Logs de produção (PM2)
pm2 logs cnpjota

# Limpar logs PM2
pm2 flush
```

## 🧹 Limpeza

```bash
# Limpar build do Next.js
rm -rf .next

# Limpar node_modules
rm -rf node_modules

# Limpar cache completo
rm -rf .next node_modules package-lock.json
npm cache clean --force
npm install

# Limpar Prisma
npx prisma generate
```

## 📊 Monitoramento

```bash
# Ver uso de recursos (Linux/Mac)
top

# Ver uso de recursos (Windows)
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Ver espaço em disco
df -h  # Linux/Mac
Get-PSDrive  # Windows PowerShell

# Ver memória
free -h  # Linux
Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property capacity -Sum  # Windows
```

## 🔄 Manutenção

```bash
# Atualizar Next.js
npm install next@latest react@latest react-dom@latest

# Atualizar Prisma
npm install @prisma/client@latest
npm install -D prisma@latest
npx prisma generate

# Atualizar todas dependências (cuidado!)
npx npm-check-updates -u
npm install

# Verificar tipos TypeScript
npx tsc --noEmit

# Bundle analyzer
npm install -D @next/bundle-analyzer
```

## 🐛 Debug

```bash
# Modo debug Node.js
NODE_OPTIONS='--inspect' npm run dev

# Verificar erros de build
npm run build 2>&1 | tee build.log

# Verificar erros de lint
npm run lint 2>&1 | tee lint.log

# Verificar performance
npm run build
npm run start
# Abra DevTools > Lighthouse
```

## 📚 Referências Rápidas

```bash
# Documentação Next.js
https://nextjs.org/docs

# Documentação Prisma
https://www.prisma.io/docs

# Documentação React
https://react.dev

# Documentação TypeScript
https://www.typescriptlang.org/docs

# Documentação Tailwind
https://tailwindcss.com/docs

# Documentação NextAuth
https://authjs.dev
```

## 🆘 Troubleshooting

```bash
# Porta 3000 já em uso
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Prisma Client desatualizado
npx prisma generate

# Build falhando
rm -rf .next
npm run build

# Git conflicts
git status
git diff
# Resolve manualmente, depois:
git add .
git commit -m "Resolve conflicts"

# Módulo não encontrado
rm -rf node_modules package-lock.json
npm install
```

---

**Dica**: Adicione esses comandos aos seus aliases/snippets favoritos! ⚡
