"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PaymentStatusAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const transactionId = searchParams.get("transaction");

    if (paymentStatus === "success" && transactionId) {
      setStatus("success");
      setShow(true);

      // Limpar URL após 5 segundos
      setTimeout(() => {
        setShow(false);
        // Remove query params da URL
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        url.searchParams.delete("transaction");
        router.replace(url.pathname);
      }, 5000);
    } else if (paymentStatus === "error") {
      setStatus("error");
      setShow(true);

      setTimeout(() => {
        setShow(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        router.replace(url.pathname);
      }, 5000);
    }
  }, [searchParams, router]);

  if (!show || !status) {
    return null;
  }

  if (status === "success") {
    return (
      <Alert className="bg-green-50 border-green-200 mb-6">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Pagamento Confirmado!
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Seus créditos foram adicionados com sucesso. Você já pode começar a
          usar!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Erro no Pagamento</AlertTitle>
      <AlertDescription>
        Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.
      </AlertDescription>
    </Alert>
  );
}
