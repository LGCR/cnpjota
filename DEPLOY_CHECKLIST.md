# 🚀 Deploy da Integração Payera

Checklist e instruções para deploy em produção.

## ✅ Pré-Deploy Checklist

### 1. Variáveis de Ambiente

Certifique-se de configurar todas as variáveis necessárias no ambiente de produção:

```env
# ⚠️ OBRIGATÓRIO
PAYERA_API_URL="https://api.payera.com.br/v1"
PAYERA_API_KEY="sua-api-key-de-producao"
PAYERA_WEBHOOK_SECRET="seu-webhook-secret-de-producao"
NEXTAUTH_URL="https://seu-dominio.com"

# ✨ RECOMENDADO
CREDIT_PACK_SMALL_AMOUNT=100
CREDIT_PACK_SMALL_PRICE=1000
CREDIT_PACK_MEDIUM_AMOUNT=500
CREDIT_PACK_MEDIUM_PRICE=4500
CREDIT_PACK_LARGE_AMOUNT=1000
CREDIT_PACK_LARGE_PRICE=8000
```

### 2. Banco de Dados

```bash
# Execute as migrations
npx prisma migrate deploy

# Popule os pacotes de créditos
npm run seed:credit-packs
```

### 3. Webhook na Payera

Configure a URL do webhook no painel da Payera:

```
https://seu-dominio.com/api/webhooks/payera
```

**Importante:** Use HTTPS em produção!

### 4. Testes Antes do Deploy

- [ ] Testar criação de pagamento
- [ ] Testar redirecionamento para Payera
- [ ] Testar webhook de confirmação
- [ ] Testar adição de créditos
- [ ] Verificar logs de erros

## 🔒 Segurança em Produção

### 1. Validação de Webhook

Certifique-se de que `PAYERA_WEBHOOK_SECRET` está configurado para validar webhooks.

### 2. HTTPS Obrigatório

O endpoint do webhook DEVE usar HTTPS:

- ✅ `https://seu-dominio.com/api/webhooks/payera`
- ❌ `http://seu-dominio.com/api/webhooks/payera`

### 3. Rate Limiting

Considere adicionar rate limiting ao webhook:

```typescript
// app/api/webhooks/payera/route.ts
import { ratelimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // ... resto do código
}
```

### 4. Logging e Monitoramento

Configure logging para produção:

```typescript
// Adicione ao webhook
console.log("[WEBHOOK]", {
  event: payload.event,
  chargeId: payload.chargeId,
  timestamp: new Date().toISOString(),
  ip: request.ip,
});
```

## 📊 Monitoramento

### 1. Alertas Recomendados

Configure alertas para:

- ❌ Falhas no processamento de webhooks
- ⏱️ Webhooks com latência alta (> 5s)
- 💳 Transações pendentes há mais de 3 dias
- 🔴 Erros ao criar cobranças na Payera

### 2. Métricas Importantes

Monitore:

- Taxa de conversão (pagamentos criados vs pagos)
- Tempo médio de confirmação de pagamento
- Valor total de transações por período
- Erros de API da Payera

### 3. Dashboard de Métricas

```sql
-- Transações por status (últimos 30 dias)
SELECT
  status,
  COUNT(*) as total,
  SUM(price) / 100.0 as total_value_brl
FROM "Transaction"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY status;

-- Taxa de conversão
SELECT
  COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid,
  COUNT(CASE WHEN status = 'EXPIRED' THEN 1 END) as expired,
  ROUND(
    COUNT(CASE WHEN status = 'PAID' THEN 1 END)::numeric /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as conversion_rate
FROM "Transaction"
WHERE "createdAt" >= NOW() - INTERVAL '30 days';
```

## 🐛 Troubleshooting em Produção

### Webhook não está sendo recebido

1. **Verifique a URL do webhook na Payera**

   - Acesse o painel da Payera
   - Confirme a URL configurada
   - Teste manualmente enviando um webhook de teste

2. **Verifique os logs do servidor**

   ```bash
   # Vercel
   vercel logs

   # Railway
   railway logs

   # Outros
   pm2 logs
   ```

3. **Teste o endpoint diretamente**
   ```bash
   curl -X GET https://seu-dominio.com/api/webhooks/payera
   ```

### Créditos não são adicionados

1. **Verifique o status da transação**

   ```sql
   SELECT * FROM "Transaction"
   WHERE "payeraChargeId" = 'charge_id_aqui';
   ```

2. **Verifique se o webhook foi processado**

   - Procure nos logs por mensagens de webhook
   - Verifique se há erros no processamento

3. **Reprocesse manualmente se necessário**
   ```typescript
   // Use Prisma Studio ou script
   await paymentService.processPaymentSuccess("charge_id_aqui");
   ```

## 🔄 Rollback Plan

Se algo der errado:

### 1. Desabilitar novos pagamentos

```typescript
// Adicione ao endpoint de pagamento
const PAYMENTS_ENABLED = process.env.ENABLE_PAYMENTS === "true";

if (!PAYMENTS_ENABLED) {
  return NextResponse.json(
    { error: "Pagamentos temporariamente indisponíveis" },
    { status: 503 }
  );
}
```

### 2. Processar webhooks pendentes

```sql
-- Encontre webhooks que falharam
SELECT * FROM "Transaction"
WHERE status = 'PENDING'
AND "createdAt" < NOW() - INTERVAL '1 hour';
```

### 3. Reverter migrations se necessário

```bash
# Cuidado: isso pode perder dados
npx prisma migrate reset
```

## 📈 Otimizações Futuras

- [ ] Cache de pacotes de créditos (Redis)
- [ ] Fila de processamento de webhooks (Bull/BullMQ)
- [ ] Retry automático para webhooks falhados
- [ ] Notificações por email após compra
- [ ] Dashboard de analytics em tempo real
- [ ] Exportação de relatórios financeiros

## 🆘 Suporte de Emergência

Em caso de problemas críticos:

1. **Desabilite pagamentos temporariamente**
2. **Notifique usuários afetados**
3. **Investigue logs e métricas**
4. **Contate suporte da Payera se necessário**
5. **Documente o incidente**

---

✅ **Checklist Final:**

- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas
- [ ] Webhook configurado na Payera
- [ ] Testes realizados
- [ ] Monitoramento configurado
- [ ] Equipe treinada
- [ ] Plano de rollback documentado

🎉 **Deploy com segurança!**
