"use client";

import type {
  CreatePaymentResponse,
  CreditPackDto,
} from "@/types/payment.types";
import { useCallback, useState } from "react";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(
    async (creditPackId: string): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ creditPackId }),
        });

        const data: CreatePaymentResponse = await response.json();

        if (data.success && data.data) {
          return data.data.paymentLink;
        } else {
          setError(data.error?.message || "Erro ao criar pagamento");
          return null;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar pagamento";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const redirectToPayment = useCallback(
    async (creditPackId: string) => {
      const paymentLink = await createPayment(creditPackId);

      if (paymentLink) {
        window.location.href = paymentLink;
      }
    },
    [createPayment]
  );

  return {
    createPayment,
    redirectToPayment,
    loading,
    error,
    clearError: () => setError(null),
  };
}

export function useCreditPacks() {
  const [packs, setPacks] = useState<CreditPackDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/payments/packs");
      const data = await response.json();

      if (data.success) {
        setPacks(data.data.packs);
      } else {
        setError(data.error?.message || "Erro ao carregar pacotes");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar pacotes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    packs,
    loading,
    error,
    fetchPacks,
    refetch: fetchPacks,
  };
}
