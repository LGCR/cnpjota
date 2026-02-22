# 🚀 Início Rápido - Integração Payera

Este guia mostra como configurar e usar a integração com a Payera API em poucos passos.

## ✅ Pré-requisitos

- Conta na Payera API
- API Key da Payera
- Webhook Secret da Payera

## 📝 Passo a Passo

### 1. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` e adicione suas credenciais da Payera:

```env
PAYERA_API_URL="https://api.payera.com.br/v1"  # ou URL de desenvolvimento
PAYERA_API_KEY="sua-api-key-aqui"
PAYERA_WEBHOOK_SECRET="seu-webhook-secret-aqui"
```

### 2. Execute as Migrations do Banco

```bash
npm run prisma:migrate
```

Quando solicitado, dê um nome para a migration (ex: `add_payment_system`).

### 3. Popule os Pacotes de Créditos

```bash
npm run seed:credit-packs
```

Isso criará 3 pacotes padrão:

- **Básico**: 100 créditos por R$ 10,00
- **Intermediário**: 500 créditos por R$ 45,00
- **Premium**: 1000 créditos por R$ 80,00

### 4. Configure o Webhook na Payera

No painel da Payera, configure a URL do webhook:

**Produção:**

```
https://seu-dominio.com/api/webhooks/payera
```

**Desenvolvimento (com ngrok):**

```bash
# Terminal 1 - Inicie o projeto
npm run dev

# Terminal 2 - Exponha com ngrok
ngrok http 3000

# Use a URL gerada pelo ngrok
https://seu-id.ngrok.io/api/webhooks/payera
```

### 5. Teste o Fluxo Completo

1. Acesse `/dashboard/credits`
2. Escolha um pacote de créditos
3. Clique em "Comprar Agora"
4. Você será redirecionado para a página de pagamento da Payera
5. Após o pagamento, será redirecionado de volta com os créditos adicionados

## 🧪 Testando Localmente

### Verificar se o webhook está ativo

```bash
curl http://localhost:3000/api/webhooks/payera
```

Resposta esperada:

```json
{
  "success": true,
  "message": "Webhook endpoint ativo",
  "timestamp": "2025-12-26T..."
}
```

### Simular um webhook manualmente

```bash
curl -X POST http://localhost:3000/api/webhooks/payera \
  -H "Content-Type: application/json" \
  -d '{
    "event": "CHARGE_PAID",
    "chargeId": "charge_id_here",
    "charge": {
      "id": "charge_id_here",
      "status": "PAID"
    },
    "timestamp": "2025-12-26T12:00:00Z"
  }'
```

## 📊 Monitoramento

### Ver logs do webhook

Os logs aparecem no console do servidor Next.js:

```bash
npm run dev
```

Procure por mensagens como:

- `Webhook recebido: { event: 'CHARGE_PAID', ... }`
- `Pagamento processado com sucesso. Transação: ...`

### Verificar transações no banco

```bash
npm run prisma:studio
```

Navegue até a tabela `Transaction` para ver todas as transações.

## 🎨 Integração no Frontend

### Adicionar botão no dashboard

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      {/* Seu dashboard existente */}

      <Link href="/dashboard/credits">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Créditos
        </Button>
      </Link>
    </div>
  );
}
```

### Exibir saldo com alerta de créditos baixos

```tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

function CreditBalance({ credits }: { credits: number }) {
  if (credits < 10) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Seus créditos estão acabando!
          <Link href="/dashboard/credits" className="underline ml-1">
            Adicionar mais créditos
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return <div>Créditos disponíveis: {credits}</div>;
}
```

## 🔐 Segurança

### Validação de Webhook

O sistema valida automaticamente a assinatura do webhook usando HMAC SHA256.

Para desabilitar (apenas em desenvolvimento):

```env
# Remova ou comente
# PAYERA_WEBHOOK_SECRET=""
```

### Rate Limiting

Considere adicionar rate limiting ao webhook endpoint em produção:

```typescript
// Exemplo com Vercel
export const config = {
  runtime: "edge",
  maxDuration: 10,
};
```

## 🐛 Problemas Comuns

### Créditos não são adicionados após pagamento

**Solução:**

1. Verifique se o webhook está configurado corretamente na Payera
2. Verifique os logs do servidor
3. Confirme que `PAYERA_WEBHOOK_SECRET` está correto
4. Teste o endpoint do webhook manualmente

### Erro ao criar pagamento

**Solução:**

1. Verifique se `PAYERA_API_KEY` é válida
2. Confirme que a URL da API está correta
3. Verifique os logs de erro no console
4. Teste a conexão com a API Payera

### Webhook não é recebido (desenvolvimento)

**Solução:**

1. Use ngrok ou similar para expor localhost
2. Configure a URL do webhook na Payera com a URL do ngrok
3. Mantenha o ngrok rodando durante os testes

## 📚 Próximos Passos

- [ ] Personalizar os valores dos pacotes de créditos
- [ ] Adicionar notificações por email após compra
- [ ] Implementar sistema de cupons de desconto
- [ ] Criar dashboard de analytics de vendas
- [ ] Adicionar suporte a outros métodos de pagamento

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique o arquivo `PAYERA_INTEGRATION.md` para documentação completa
2. Consulte os logs do servidor e do webhook
3. Verifique o status das transações no Prisma Studio
4. Consulte a documentação da Payera API

---

✨ **Dica:** Configure alertas de monitoramento para eventos de webhook em produção!
