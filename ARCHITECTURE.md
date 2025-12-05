# Arquitetura CNPJota

## 📐 Visão Geral

O CNPJota é construído seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, com clara separação de responsabilidades entre camadas.

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Next.js Pages, Components, API Routes)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Controller Layer                       │
│  (Request/Response handling, Validation)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Service Layer                         │
│  (Business Logic, Orchestration)                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Repository Layer                        │
│  (Data Access, Persistence)                             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Database Layer                        │
│  (PostgreSQL via Prisma)                                │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Estrutura de Camadas

### 1. Presentation Layer (app/)

**Responsabilidade:** Interface com o usuário e definição de rotas.

```
app/
├── api/              # API Routes
│   ├── auth/        # NextAuth endpoints
│   └── v1/          # API versão 1
├── dashboard/       # Dashboard UI
├── login/           # Login page
└── layout.tsx       # Root layout
```

**Tecnologias:**
- Next.js 15 (App Router)
- React 19
- Server Components / Client Components

### 2. Controller Layer (controllers/)

**Responsabilidade:** Orquestração de requisições HTTP, validação inicial e formatação de respostas.

```typescript
// Exemplo: CnpjController
class CnpjController {
  async lookup(request: NextRequest): Promise<ApiResponse> {
    // 1. Autenticação
    const user = await validateApiKey(request);
    
    // 2. Validação de entrada
    const cnpj = extractCnpjFromUrl(request);
    
    // 3. Rate limiting
    await rateLimiter.checkLimit(user.id);
    
    // 4. Verificação de créditos
    await creditService.checkBalance(user.id);
    
    // 5. Chama o service
    const result = await cnpjService.lookup(cnpj);
    
    // 6. Formata resposta
    return formatResponse(result);
  }
}
```

**Princípios:**
- Controllers são **thin** (pouca lógica)
- Apenas orquestração e formatação
- Não conhecem detalhes de implementação

### 3. Service Layer (services/)

**Responsabilidade:** Lógica de negócio, regras de domínio e orquestração de repositórios.

```
services/
├── cnpj.service.ts           # Lógica de consulta CNPJ
├── cnpj-providers.service.ts # Integração com APIs externas
└── credit.service.ts         # Gestão de créditos
```

**Exemplo:**

```typescript
class CnpjService {
  async lookup(cnpj: string) {
    // 1. Valida CNPJ
    if (!isValidCnpj(cnpj)) throw new ValidationError();
    
    // 2. Busca no cache
    const cached = await repository.findByCnpj(cnpj);
    
    // 3. Verifica se está desatualizado
    if (cached && !isOutdated(cached)) {
      return { data: cached, fromCache: true };
    }
    
    // 4. Consulta APIs externas
    const data = await providerManager.fetchWithFallback(cnpj);
    
    // 5. Atualiza cache
    await repository.upsert(cnpj, data);
    
    return { data, fromCache: false };
  }
}
```

### 4. Repository Layer (repositories/)

**Responsabilidade:** Abstração de acesso a dados, queries e persistência.

```typescript
class CnpjRepository {
  async findByCnpj(cnpj: string): Promise<CnpjData | null> {
    return prisma.cnpjData.findUnique({ where: { cnpj } });
  }
  
  async upsert(cnpj: string, data: CnpjResponseDto): Promise<CnpjData> {
    return prisma.cnpjData.upsert({
      where: { cnpj },
      create: { /* ... */ },
      update: { /* ... */ },
    });
  }
}
```

## 🔄 Fluxo de Dados

### Consulta de CNPJ (Happy Path)

```
1. Cliente envia GET /api/v1/cnpj/00000000000191
   ↓
2. CnpjController.lookup()
   → Valida API Key
   → Verifica rate limit
   → Verifica créditos
   ↓
3. CnpjService.lookup()
   → Busca no cache
   → Se não existe ou desatualizado:
     - CnpjProviderManager.fetchWithFallback()
       → Tenta BrasilAPI
       → Se falhar, tenta OpenCNPJ
       → Se falhar, tenta CNPJá
       → Se falhar, tenta ReceitaWS
   ↓
4. CnpjRepository.upsert()
   → Salva/atualiza no PostgreSQL
   ↓
5. CreditService.deductCredits()
   → Deduz créditos do usuário
   ↓
6. CnpjRepository.logQuery()
   → Registra a consulta
   ↓
7. Controller formata e retorna resposta
```

### Fallback entre APIs Externas

```
BrasilAPI (Priority 1)
   ↓ (falha)
OpenCNPJ (Priority 2)
   ↓ (falha)
CNPJá (Priority 3)
   ↓ (falha)
ReceitaWS (Priority 4)
   ↓ (falha)
ExternalApiError
```

## 🔐 Segurança

### Autenticação e Autorização

```
┌──────────────┐
│  Cliente     │
└──────┬───────┘
       │ Authorization: Bearer cnpj_xxx...
       ↓
┌──────────────────────┐
│  validateApiKey()    │
│  - Extrai API key    │
│  - Hash SHA-256      │
│  - Busca no DB       │
│  - Valida active     │
└──────┬───────────────┘
       │
       ↓ User object
┌──────────────────────┐
│  Controller/Service  │
└──────────────────────┘
```

### Rate Limiting

```typescript
// In-memory rate limiter
Map<userId, { count: number, resetAt: timestamp }>

checkLimit(userId, maxRequests, windowMs) {
  if (count >= maxRequests && now < resetAt) {
    throw RateLimitError();
  }
  count++;
}
```

## 💾 Modelo de Dados

### Relacionamentos Principais

```
User (1) ──────── (N) ApiKey
  │
  │ (N)
  ├────────────── Credit
  │
  │ (N)
  ├────────────── CnpjQuery
  │
  │ (N:1)
  └────────────── Plan

CnpjData (1) ─── (N) CnpjQuery
```

### Estratégia de Cache

```
┌─────────────────────────────────────────┐
│ CnpjData                                │
├─────────────────────────────────────────┤
│ - cnpj (unique)                         │
│ - razaoSocial                           │
│ - ... (todos os campos)                 │
│ - source (qual API forneceu)            │
│ - lastUpdatedAt (controle de cache)     │
└─────────────────────────────────────────┘

Regra: Se (now - lastUpdatedAt) >= 15 dias
  → Consultar APIs externas
  → Atualizar cache
Senão:
  → Retornar do cache
```

## 📊 Sistema de Créditos

### Modelo de Planos

```typescript
interface Plan {
  creditCost: number;        // Ex: 0.33
  maxRequestsPerSecond: number; // Ex: 2
}

// Cálculo simples:
custo_consulta = plano.creditCost
```

### Transações de Crédito

```
Credit (ledger-style)
├── PURCHASE  (+100)
├── BONUS     (+100)
├── DEDUCTION (-0.33)
├── DEDUCTION (-0.33)
└── REFUND    (+0.33)

Balance = SUM(amount)
```

## 🚀 Escalabilidade

### Pontos de Otimização Futuros

1. **Cache Redis**
   - Migrar cache de PostgreSQL para Redis
   - TTL automático de 15 dias
   - Suporta milhões de CNPJs

2. **Queue System**
   - Consultas em lote via filas (Bull/BullMQ)
   - Rate limiting distribuído

3. **CDN**
   - Cache de consultas frequentes em edge

4. **Database**
   - Read replicas para consultas
   - Particionamento por range de CNPJ

## 🧪 Testabilidade

A arquitetura facilita testes unitários:

```typescript
// Service Layer - Pure business logic
describe('CnpjService', () => {
  it('should return cached data if not outdated', async () => {
    // Mock repository
    const repository = {
      findByCnpj: jest.fn().mockResolvedValue(cachedData),
      isOutdated: jest.fn().mockReturnValue(false)
    };
    
    const service = new CnpjService(repository);
    const result = await service.lookup('00000000000191');
    
    expect(result.fromCache).toBe(true);
  });
});
```

## 📈 Monitoramento

### Métricas Importantes

```typescript
// Logs estruturados
{
  userId: string,
  cnpj: string,
  source: 'cache' | 'BrasilAPI' | 'OpenCNPJ' | ...,
  creditCost: number,
  responseTime: number,
  success: boolean,
  timestamp: Date
}
```

### Queries Úteis

```sql
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
```

## 🔧 Manutenção

### Rotinas Recomendadas

1. **Limpeza de cache antigo** (opcional)
   ```sql
   DELETE FROM "CnpjData"
   WHERE "lastUpdatedAt" < NOW() - INTERVAL '90 days'
   AND id NOT IN (
     SELECT DISTINCT "cnpjDataId" FROM "CnpjQuery"
     WHERE "createdAt" > NOW() - INTERVAL '30 days'
   );
   ```

2. **Análise de uso**
   - Monitorar consultas por usuário
   - Detectar padrões de abuso
   - Ajustar rate limits

## 🎯 Decisões Arquiteturais

### Por que Next.js?
- ✅ SSR/SSG para SEO
- ✅ API Routes integradas
- ✅ Excelente DX
- ✅ Deploy simples (Vercel)

### Por que Prisma?
- ✅ Type-safe queries
- ✅ Migrações automáticas
- ✅ Prisma Studio para debug
- ✅ Suporte a PostgreSQL

### Por que PostgreSQL?
- ✅ ACID compliant
- ✅ JSON support (sócios)
- ✅ Índices eficientes
- ✅ Gratuito (Supabase)

### Por que múltiplas APIs externas?
- ✅ Alta disponibilidade (99.9%+)
- ✅ Fallback automático
- ✅ Sem vendor lock-in
- ✅ Melhor custo-benefício

---

Esta arquitetura foi projetada para ser:
- 📦 **Modular** - fácil adicionar features
- 🧪 **Testável** - camadas desacopladas
- 🚀 **Escalável** - pronta para crescer
- 🔒 **Segura** - múltiplas camadas de proteção
