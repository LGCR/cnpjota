# 📚 Exemplos de Uso - API de Pagamentos

Exemplos práticos de como usar a API de pagamentos integrada com a Payera.

## 🎯 Casos de Uso

### 1. Listar Pacotes Disponíveis

```typescript
// GET /api/v1/payments/packs
const response = await fetch("/api/v1/payments/packs");
const data = await response.json();

console.log(data);
// {
//   "success": true,
//   "data": {
//     "packs": [
//       {
//         "id": "clx1...",
//         "name": "SMALL",
//         "displayName": "Pacote Básico",
//         "credits": 100,
//         "price": 1000,
//         "priceFormatted": "R$ 10,00",
//         "description": "Ideal para começar"
//       },
//       ...
//     ]
//   }
// }
```

### 2. Criar Pagamento

```typescript
// POST /api/v1/payments
const response = await fetch("/api/v1/payments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    creditPackId: "clx1...",
  }),
});

const data = await response.json();

if (data.success) {
  // Redirecionar para página de pagamento
  window.location.href = data.data.paymentLink;
}

// Response:
// {
//   "success": true,
//   "data": {
//     "transactionId": "clx2...",
//     "paymentLink": "https://pay.payera.com/...",
//     "credits": 100,
//     "price": 1000
//   }
// }
```

### 3. Ver Histórico de Transações

```typescript
// GET /api/v1/payments/history?limit=10
const response = await fetch("/api/v1/payments/history?limit=10");
const data = await response.json();

console.log(data);
// {
//   "success": true,
//   "data": {
//     "transactions": [
//       {
//         "id": "clx2...",
//         "status": "PAID",
//         "amount": 100,
//         "price": 1000,
//         "createdAt": "2025-12-26T...",
//         "paidAt": "2025-12-26T...",
//         "creditPack": {
//           "displayName": "Pacote Básico"
//         }
//       }
//     ]
//   }
// }
```

## 🎨 Exemplos de Componentes React

### Componente de Compra Rápida

```tsx
"use client";

import { usePayment } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";

export function QuickBuyButton({ packId }: { packId: string }) {
  const { redirectToPayment, loading, error } = usePayment();

  return (
    <div>
      <Button onClick={() => redirectToPayment(packId)} disabled={loading}>
        {loading ? "Processando..." : "Comprar"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

### Lista de Pacotes com Hook Customizado

```tsx
"use client";

import { useEffect } from "react";
import { useCreditPacks } from "@/hooks/use-payment";
import { Card } from "@/components/ui/card";

export function PacksList() {
  const { packs, loading, error, fetchPacks } = useCreditPacks();

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {packs.map((pack) => (
        <Card key={pack.id} className="p-4">
          <h3>{pack.displayName}</h3>
          <p>{pack.credits} créditos</p>
          <p className="font-bold">{pack.priceFormatted}</p>
          <QuickBuyButton packId={pack.id} />
        </Card>
      ))}
    </div>
  );
}
```

### Modal de Confirmação

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/hooks/use-payment";

interface ConfirmPurchaseProps {
  pack: {
    id: string;
    displayName: string;
    credits: number;
    priceFormatted: string;
  };
  onClose: () => void;
}

export function ConfirmPurchaseDialog({ pack, onClose }: ConfirmPurchaseProps) {
  const [open, setOpen] = useState(true);
  const { redirectToPayment, loading } = usePayment();

  const handleConfirm = async () => {
    await redirectToPayment(pack.id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>
            Você será redirecionado para a página de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pacote:</span>
              <span className="font-medium">{pack.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span>Créditos:</span>
              <span className="font-medium">{pack.credits}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Total:</span>
              <span className="font-bold">{pack.priceFormatted}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 🔧 Exemplos de Server Actions (Next.js 14+)

### Server Action para Criar Pagamento

```typescript
"use server";

import { auth } from "@/lib/auth";
import { paymentService } from "@/services/payment.service";
import { redirect } from "next/navigation";

export async function createPaymentAction(packId: string) {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Não autenticado");
  }

  try {
    const payment = await paymentService.createPayment({
      userId: session.user.id,
      creditPackId: packId,
      userEmail: session.user.email,
      userName: session.user.name || undefined,
    });

    redirect(payment.paymentLink);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    throw error;
  }
}
```

### Usando Server Action no Cliente

```tsx
"use client";

import { createPaymentAction } from "./actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function BuyButton({ packId }: { packId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          await createPaymentAction(packId);
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Processando..." : "Comprar"}
    </Button>
  );
}
```

## 📱 Exemplo de Integração Mobile (React Native)

```typescript
import { useState } from "react";
import { Alert, Linking } from "react-native";

export function useMobilePayment() {
  const [loading, setLoading] = useState(false);

  const createPayment = async (packId: string) => {
    try {
      setLoading(true);

      const response = await fetch("https://seu-dominio.com/api/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ creditPackId: packId }),
      });

      const data = await response.json();

      if (data.success) {
        // Abrir link de pagamento no navegador
        await Linking.openURL(data.data.paymentLink);
      } else {
        Alert.alert("Erro", data.error?.message || "Erro ao criar pagamento");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading };
}
```

## 🔐 Exemplo com Autenticação via API Key

```typescript
// Para uso em aplicações externas via API Key
async function createPaymentWithApiKey(apiKey: string, packId: string) {
  const response = await fetch("https://seu-dominio.com/api/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      creditPackId: packId,
    }),
  });

  return response.json();
}
```

## 📊 Exemplo de Dashboard de Vendas

```typescript
// app/admin/sales/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SalesDashboard() {
  const stats = await prisma.transaction.groupBy({
    by: ["status"],
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
      },
    },
    _count: true,
    _sum: {
      price: true,
    },
  });

  const totalRevenue =
    stats
      .filter((s) => s.status === "PAID")
      .reduce((acc, s) => acc + (s._sum.price || 0), 0) / 100;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Receita Total (30d)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalRevenue)}
          </p>
        </CardContent>
      </Card>

      {/* Adicione mais cards conforme necessário */}
    </div>
  );
}
```

## 🧪 Exemplo de Teste E2E (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("fluxo completo de compra de créditos", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('input[type="email"]', "test@example.com");
  await page.click('button[type="submit"]');

  // Navegar para adicionar créditos
  await page.goto("/dashboard/credits");

  // Selecionar pacote
  await page.click('[data-pack-id="pack-medium"]');

  // Aguardar redirecionamento
  await page.waitForURL(/pay\.payera\.com/);

  expect(page.url()).toContain("payera.com");
});
```

---

💡 **Dica:** Adapte esses exemplos conforme suas necessidades específicas!
