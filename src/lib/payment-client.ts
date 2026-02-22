/**
 * payment-client.ts — Fachada unificada para integração de pagamentos
 *
 * Seleciona a implementação com base na variável de ambiente CLICKPAY_USE_SDK:
 *   CLICKPAY_USE_SDK=true  → usa @clickpay/sdk  (ClickpayClient)
 *   CLICKPAY_USE_SDK=false → usa fetch direto    (PayeraClient)  ← padrão
 *
 * Todos os serviços e rotas devem importar deste arquivo em vez de importar
 * diretamente de payera-client.ts ou clickpay-client.ts.
 */

// ── Re-exportar tipos para que os consumidores não precisem saber qual
//    implementação está ativa
export type {
  PayeraCharge,
  PayeraChargeResponse,
  PayeraCustomer,
  PayeraWebhookPayload,
} from "./payera-client";

// ── Interface comum que ambos os clientes implementam
import type { PayeraCharge, PayeraChargeResponse } from "./payera-client";

export interface IPaymentClient {
  createCharge(charge: PayeraCharge): Promise<PayeraChargeResponse>;
  getCharge(chargeId: string): Promise<PayeraChargeResponse>;
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret?: string,
  ): boolean;
}

// ── Implementações
import { ClickpayClient } from "./clickpay-client";
import { PayeraClient } from "./payera-client";

// ──────────────────────────────────────────────
// Flag de controle
// ──────────────────────────────────────────────

/**
 * Retorna `true` se o SDK ClickPay deve ser usado.
 *
 * Controlado por:
 *   CLICKPAY_USE_SDK=true   → SDK (@clickpay/sdk)
 *   CLICKPAY_USE_SDK=false  → API direta (payera-client) — padrão
 */
function useSdk(): boolean {
  const flag = process.env.CLICKPAY_USE_SDK;
  return flag === "true" || flag === "1";
}

// ──────────────────────────────────────────────
// Factory
// ──────────────────────────────────────────────

/**
 * Cria e retorna o cliente de pagamento ativo conforme a flag CLICKPAY_USE_SDK.
 *
 * @throws {Error} Se as variáveis de ambiente necessárias não estiverem definidas.
 */
function createPaymentClient(): IPaymentClient {
  if (useSdk()) {
    console.info(
      "[payment-client] Usando @clickpay/sdk (CLICKPAY_USE_SDK=true)",
    );
    return new ClickpayClient();
  }

  console.info(
    "[payment-client] Usando API direta (CLICKPAY_USE_SDK não definido)",
  );
  return new PayeraClient();
}

// ──────────────────────────────────────────────
// Singleton exportado
// ──────────────────────────────────────────────

/**
 * Instância singleton do cliente de pagamento.
 *
 * Importar e usar diretamente:
 * ```ts
 * import { paymentClient } from "@/lib/payment-client";
 *
 * const charge = await paymentClient.createCharge({ ... });
 * ```
 */
export const paymentClient: IPaymentClient = createPaymentClient();

/**
 * @deprecated Alias para retrocompatibilidade.
 * Prefira `paymentClient`.
 */
export const payeraClient = paymentClient;
