# Integração Payera API - CNPJota

Este documento descreve a integração com a Payera API para pagamentos de créditos no CNPJota.

## 📋 Visão Geral

A integração permite que usuários comprem créditos através de links de pagamento gerados pela Payera API. O sistema gerencia automaticamente:

- Criação de cobranças
- Redirecionamento para pagamento
- Processamento de webhooks
- Adição automática de créditos após confirmação

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Payera API Integration
PAYERA_API_URL="http://localhost:3001/api/v1"
PAYERA_API_KEY="sua-api-key-aqui"
PAYERA_WEBHOOK_SECRET="seu-secret-webhook-aqui"

# Pacotes de Créditos (valores em centavos)
CREDIT_PACK_SMALL_AMOUNT=100
CREDIT_PACK_SMALL_PRICE=1000
CREDIT_PACK_MEDIUM_AMOUNT=500
CREDIT_PACK_MEDIUM_PRICE=4500
CREDIT_PACK_LARGE_AMOUNT=1000
CREDIT_PACK_LARGE_PRICE=8000
```

### 2. Executar Migrations

```bash
npx prisma migrate dev --name add_payment_system
```

### 3. Popular Pacotes de Créditos

```bash
npx tsx scripts/seed-credit-packs.ts
```

## 📦 Estrutura de Arquivos

```
src/
├── lib/
│   └── payera-client.ts          # Cliente HTTP para Payera API
├── services/
│   ├── payment.service.ts        # Serviço de gerenciamento de pagamentos
│   └── credit.service.ts         # Serviço de créditos (já existente)
├── components/
│   ├── add-credits-dialog.tsx    # Componente UI para compra de créditos
│   └── transaction-history.tsx   # Histórico de transações
├── app/
│   └── api/
│       ├── v1/
│       │   └── payments/
│       │       ├── route.ts      # GET packs, POST create payment
│       │       └── history/
│       │           └── route.ts  # GET transaction history
│       └── webhooks/
│           └── payera/
│               └── route.ts      # Webhook receiver
prisma/
└── schema.prisma                 # Schema atualizado com Transaction e CreditPack
```

## 🔄 Fluxo de Pagamento

### 1. Usuário Solicita Créditos

```typescript
// Frontend chama o endpoint
POST /api/v1/payments
{
  "creditPackId": "pack_id_here"
}

// Retorna
{
  "success": true,
  "data": {
    "transactionId": "...",
    "paymentLink": "https://pay.payera.com/...",
    "credits": 500,
    "price": 4500
  }
}
```

### 2. Redirecionamento

O frontend redireciona o usuário para `paymentLink`.

### 3. Callback Após Pagamento

Após o pagamento, a Payera redireciona para:

```
https://seu-dominio.com/dashboard?payment=success&transaction=<id>
```

### 4. Webhook de Confirmação

A Payera envia um webhook para:

```
POST /api/webhooks/payera
```

O webhook processa automaticamente:

- `CHARGE_PAID` → Adiciona créditos ao usuário
- `CHARGE_EXPIRED` → Marca transação como expirada
- `CHARGE_CANCELLED` → Marca transação como cancelada

## 🎨 Componentes UI

### AddCreditsDialog

Exibe os pacotes de créditos disponíveis e permite compra:

```tsx
import { AddCreditsDialog } from "@/components/add-credits-dialog";

export default function CreditsPage() {
  return <AddCreditsDialog />;
}
```

### TransactionHistory

Exibe o histórico de transações do usuário:

```tsx
import { TransactionHistory } from "@/components/transaction-history";

export default function HistoryPage() {
  return <TransactionHistory />;
}
```

## 🔐 Segurança

### Verificação de Webhook

O sistema verifica a assinatura do webhook usando HMAC SHA256:

```typescript
const isValid = payeraClient.verifyWebhookSignature(
  rawBody,
  signature,
  webhookSecret
);
```

Configure `PAYERA_WEBHOOK_SECRET` para habilitar esta verificação.

## 📊 Models do Prisma

### CreditPack

```prisma
model CreditPack {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String
  credits     Float
  price       Int      // em centavos
  description String?
  active      Boolean  @default(true)
}
```

### Transaction

```prisma
model Transaction {
  id             String            @id @default(cuid())
  userId         String
  payeraChargeId String            @unique
  paymentLink    String
  status         TransactionStatus @default(PENDING)
  amount         Float             // créditos
  price          Int               // centavos
  createdAt      DateTime          @default(now())
  paidAt         DateTime?
}

enum TransactionStatus {
  PENDING
  PAID
  EXPIRED
  CANCELLED
  REFUNDED
}
```

## 🧪 Testes

### Testar Webhook Localmente

Use o ngrok ou similar para expor localhost:

```bash
ngrok http 3000
```

Configure o webhook URL na Payera:

```
https://seu-ngrok-url.ngrok.io/api/webhooks/payera
```

### Verificar Health do Webhook

```bash
curl http://localhost:3000/api/webhooks/payera
```

## 📝 Endpoints da API

| Método | Endpoint                   | Descrição                 |
| ------ | -------------------------- | ------------------------- |
| GET    | `/api/v1/payments/packs`   | Lista pacotes de créditos |
| POST   | `/api/v1/payments`         | Cria novo pagamento       |
| GET    | `/api/v1/payments/history` | Histórico de transações   |
| POST   | `/api/webhooks/payera`     | Recebe webhooks da Payera |
| GET    | `/api/webhooks/payera`     | Health check do webhook   |

## 🚀 Próximos Passos

1. Configurar a Payera API no ambiente de produção
2. Obter API Key e Webhook Secret
3. Configurar webhook URL na Payera
4. Testar fluxo completo em staging
5. Monitorar logs de webhooks
6. Implementar notificações por email (opcional)

## 🐛 Troubleshooting

### Webhook não está sendo recebido

1. Verifique se a URL está acessível publicamente
2. Verifique os logs da Payera
3. Teste com `curl` manualmente
4. Verifique se o PAYERA_WEBHOOK_SECRET está correto

### Créditos não são adicionados após pagamento

1. Verifique os logs do webhook
2. Verifique se o `payeraChargeId` existe na tabela Transaction
3. Verifique o status da transação no banco
4. Verifique se o evento `CHARGE_PAID` foi recebido

### Erro ao criar pagamento

1. Verifique se PAYERA_API_URL está correto
2. Verifique se PAYERA_API_KEY é válida
3. Verifique os logs da API Payera
4. Verifique se os pacotes de créditos existem no banco

## 📞 Suporte

Para problemas relacionados à integração, verifique:

- Logs da aplicação
- Logs do webhook endpoint
- Status das transações no banco de dados
- Documentação da Payera API
