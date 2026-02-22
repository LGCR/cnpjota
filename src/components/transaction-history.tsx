"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Receipt,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  payeraChargeId: string;
  status: string;
  amount: number;
  price: number;
  createdAt: string;
  paidAt?: string;
  creditPack?: {
    displayName: string;
  };
}

const statusConfig = {
  PENDING: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-400",
  },
  PAID: {
    label: "Pago",
    variant: "default" as const,
    icon: CheckCircle2,
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    dotColor: "bg-green-500",
  },
  EXPIRED: {
    label: "Expirado",
    variant: "destructive" as const,
    icon: XCircle,
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    dotColor: "bg-red-400",
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "outline" as const,
    icon: AlertCircle,
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    dotColor: "bg-gray-400",
  },
  REFUNDED: {
    label: "Reembolsado",
    variant: "outline" as const,
    icon: RotateCcw,
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-400",
  },
};

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/payments/history");
      const data = await response.json();

      if (data.success) {
        setTransactions(data.data.transactions);
      } else {
        setError(data.error?.message || "Erro ao carregar histórico");
      }
    } catch (err) {
      setError("Erro ao carregar histórico de transações");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM yyyy, HH:mm", {
      locale: ptBR,
    });
  };

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm text-gray-500">Carregando transações...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-400" />
            <p className="text-center text-red-600 font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="icon-wrapper-light">
            <Receipt className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Histórico de Transações</CardTitle>
            <CardDescription>
              {transactions.length > 0
                ? `${transactions.length} transaç${transactions.length === 1 ? "ão" : "ões"} encontrada${transactions.length === 1 ? "" : "s"}`
                : "Suas compras de créditos aparecerão aqui"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">
              Nenhuma transação ainda
            </p>
            <p className="text-sm text-gray-500">
              Quando você comprar créditos, suas transações aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const config =
                statusConfig[transaction.status as keyof typeof statusConfig] ||
                statusConfig.PENDING;
              const StatusIcon = config.icon;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <p className="font-semibold text-gray-900 text-sm">
                          {transaction.creditPack?.displayName ||
                            "Pacote de Créditos"}
                        </p>
                        <Badge
                          className={`text-[10px] uppercase tracking-wider font-bold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                          variant="outline"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${config.dotColor} mr-1`}
                          />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                        {transaction.paidAt && (
                          <span className="text-green-600 ml-2">
                            &middot; Pago em {formatDate(transaction.paidAt)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-gray-900">
                      {formatPrice(transaction.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.amount.toLocaleString("pt-BR")} créditos
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
