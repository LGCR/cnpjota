import { PayeraWebhookPayload } from "@/lib/payment-client";
import { paymentService } from "@/services/payment.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/payera
 * Recebe notificações de eventos da Payera
 */
export async function POST(request: NextRequest) {
  try {
    // Obter corpo da requisição como texto para validação de assinatura
    const rawBody = await request.text();

    // Verificar assinatura do webhook (se configurado)
    // const signature = request.headers.get("x-payera-signature") || "";

    // if (process.env.PAYERA_WEBHOOK_SECRET) {
    //   const isValid = payeraClient.verifyWebhookSignature(rawBody, signature);

    //   if (!isValid) {
    //     console.error("Assinatura do webhook inválida");
    //     return NextResponse.json(
    //       { success: false, error: { message: "Assinatura inválida" } },
    //       { status: 401 }
    //     );
    //   }
    // }

    // Parse do payload
    const payload: PayeraWebhookPayload = JSON.parse(rawBody);

    console.log("Webhook recebido:", {
      event: payload.event,
      chargeId: payload.data.chargeId,
      paymentStatus: payload.data.paymentStatus,
      timestamp: payload.timestamp,
    });

    // Processar evento baseado no tipo
    switch (payload.event) {
      case "charge.paid":
      case "charge.received":
        await paymentService.processPaymentSuccess(payload.data.chargeId);
        break;

      case "charge.expired":
        await paymentService.processPaymentExpired(payload.data.chargeId);
        break;

      case "charge.pending":
      case "charge.processing":
        // Apenas log, cobrança em processamento
        console.log(
          "Cobrança em processamento:",
          payload.data.chargeId,
          payload.data.paymentStatus,
        );
        break;

      default:
        console.warn("Evento desconhecido:", payload.event);
    }

    // Sempre retornar 200 para a Payera saber que recebemos
    return NextResponse.json({
      success: true,
      message: "Webhook processado",
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);

    // Retornar 200 mesmo em erro para evitar reenvios desnecessários
    // mas logar o erro para investigação
    return NextResponse.json({
      success: false,
      error: { message: "Erro ao processar webhook" },
    });
  }
}

/**
 * GET /api/webhooks/payera
 * Endpoint para verificação de health check
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Webhook endpoint ativo",
    timestamp: new Date().toISOString(),
  });
}
