"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Coins, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CreditPack {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  price: number;
  priceFormatted: string;
  description?: string;
}

export function AddCreditsDialog() {
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPack, setProcessingPack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/payments/packs");
      const data = await response.json();

      console.log("Resposta da API de pacotes:", data);

      if (data.success) {
        console.log("Pacotes carregados:", data.data.packs);
        setPacks(data.data.packs);
      } else {
        console.error("Erro ao carregar pacotes:", data.error);
        setError(data.error?.message || "Erro ao carregar pacotes");
      }
    } catch (err) {
      setError("Erro ao carregar pacotes de créditos");
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packId: string) => {
    try {
      setProcessingPack(packId);
      setError(null);

      const response = await fetch("/api/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creditPackId: packId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.paymentLink;
      } else {
        setError(data.error?.message || "Erro ao criar pagamento");
        setProcessingPack(null);
      }
    } catch (err) {
      setError("Erro ao processar pagamento");
      console.error(err);
      setProcessingPack(null);
    }
  };

  const isPopular = (name: string) => name === "MEDIUM";

  const getBestValue = (packs: CreditPack[]) => {
    if (packs.length === 0) return null;
    return packs.reduce((best, pack) => {
      const costPerCredit = pack.price / pack.credits;
      const bestCostPerCredit = best.price / best.credits;
      return costPerCredit < bestCostPerCredit ? pack : best;
    });
  };

  const bestValue = getBestValue(packs);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="text-sm text-gray-500">Carregando pacotes...</p>
      </div>
    );
  }

  if (packs.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-gray-500">
          Nenhum pacote de crédito disponível no momento.
        </p>
        <Button onClick={loadPacks} variant="outline" size="sm">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="icon-wrapper">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Adicionar Créditos
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Escolha o pacote ideal para o seu volume de consultas
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
        <div className="absolute inset-0 banner-cnpjota rounded-xl z-0"></div>
        <div className="grid gap-6 md:grid-cols-3 relative z-10">
          {packs.map((pack) => {
            const pricePerCredit = pack.price / pack.credits / 100;
            const isBest = bestValue?.id === pack.id && packs.length > 1;
            const popular = isPopular(pack.name);

            return (
              <Card
                key={pack.id}
                className={`relative transition-all duration-300 overflow-hidden ${
                  popular
                    ? "border-2 border-purple-400 shadow-lg shadow-purple-100 scale-[1.02]"
                    : "border border-gray-200 hover:border-purple-200 hover:shadow-md"
                }`}
              >
                {popular && (
                  <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-purple-600 to-purple-500 text-white text-center text-xs font-semibold py-1.5 tracking-wide uppercase">
                    Mais Popular
                  </div>
                )}

                <CardHeader className={popular ? "pt-10" : ""}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pack.displayName}
                    </h3>
                    {isBest && !popular && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] uppercase tracking-wider font-bold">
                        Melhor valor
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {pack.description ||
                      `${pack.credits} créditos para consultas`}
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {pack.priceFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center text-[10px] font-semibold">
                        C
                      </div>
                      <span className="font-medium">
                        {pack.credits.toLocaleString("pt-BR")} créditos
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {pricePerCredit.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}{" "}
                      por crédito &middot; ~
                      {Math.floor(pack.credits / 0.33).toLocaleString("pt-BR")}{" "}
                      consultas
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Créditos sem validade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Ativação instantânea</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Suporte incluso</span>
                    </li>
                  </ul>

                  <Button
                    className={`w-full font-semibold transition-all ${
                      popular
                        ? "gradient-purple text-white shadow-md hover:shadow-lg"
                        : ""
                    }`}
                    variant={popular ? "default" : "outline"}
                    onClick={() => handlePurchase(pack.id)}
                    disabled={processingPack !== null}
                  >
                    {processingPack === pack.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Comprar Agora
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
        <p className="font-semibold text-gray-800 mb-3 text-sm">
          Como funciona
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "1", text: "Escolha o pacote desejado" },
            { step: "2", text: "Pague de forma segura" },
            { step: "3", text: "Créditos adicionados na hora" },
            { step: "4", text: "Comece a consultar CNPJs" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600">
                {item.step}
              </div>
              <p className="text-sm text-gray-600 pt-0.5">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
