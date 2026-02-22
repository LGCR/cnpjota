/**
 * Cliente HTTP para integração com Payera API
 */

export interface PayeraCustomer {
  name: string;
  email: string;
  taxId?: string;
  phone?: string;
}

export interface PayeraCharge {
  value: number; // valor em centavos
  description?: string;
  customer?: PayeraCustomer;
  expiresIn?: number; // dias até expiração
  metadata?: Record<string, any>;
  redirectUrl?: string; // URL de retorno após pagamento
  webhookUrl?: string; // URL para receber notificações
}

export interface PayeraChargeResponse {
  id: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  value: number;
  description: string;
  paymentLink: string;
  qrCode?: string;
  pixKey?: string;
  expiresAt: string;
  createdAt: string;
  customer: PayeraCustomer;
  metadata?: Record<string, any>;
}

export interface PayeraWebhookPayload {
  event:
    | "charge.pending"
    | "charge.processing"
    | "charge.paid"
    | "charge.received"
    | "charge.expired";
  data: {
    chargeId: string;
    companyId: string;
    paymentStatus: string;
    previousStatus?: string;
    total: number;
    externalId?: string | null;
    customer?: {
      id: string | null;
      name: string | null;
      email: string | null;
      phone: string | null;
    } | null;
    paidAt?: string | null;
    expiresAt?: string | null;
    devMode: boolean;
  };
  timestamp: string;
}

export class PayeraClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || process.env.PAYERA_API_URL || "";
    this.apiKey = apiKey || process.env.PAYERA_API_KEY || "";

    if (!this.apiUrl || !this.apiKey) {
      throw new Error("Payera API URL e API Key são obrigatórios");
    }
  }

  /**
   * Cria uma nova cobrança na Payera
   */
  async createCharge(charge: PayeraCharge): Promise<PayeraChargeResponse> {
    const requestBody: any = {
      total: charge.value,
    };

    // Adicionar campos opcionais apenas se fornecidos
    if (charge.customer) {
      requestBody.customer = {
        name: charge.customer.name,
        email: charge.customer.email,
        taxId: charge.customer.taxId,
        phone: charge.customer.phone,
      };
    }

    if (charge.redirectUrl) {
      requestBody.successUrl = charge.redirectUrl;
    }

    if (charge.metadata) {
      requestBody.metadata = charge.metadata;
    }

    const response = await fetch(`${this.apiUrl}/charge/payment-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(
        `Erro ao criar cobrança: ${error.message || response.statusText}`
      );
    }

    const result = await response.json();

    // Mapear resposta do payera-api para o formato esperado
    return {
      id: result.data?.id || "",
      status: "PENDING",
      value: charge.value,
      description: charge.description || "",
      paymentLink: result.data?.url || "",
      qrCode: result.data?.pixQrCode,
      pixKey: result.data?.pixKey,
      expiresAt: "", // payera-api não retorna isso diretamente
      createdAt: new Date().toISOString(),
      customer: charge.customer || { name: "", email: "" },
      metadata: charge.metadata,
    };
  }

  /**
   * Consulta uma cobrança existente
   */
  async getCharge(chargeId: string): Promise<PayeraChargeResponse> {
    const response = await fetch(`${this.apiUrl}/charges/${chargeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "x-api-key": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(
        `Erro ao consultar cobrança: ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Cancela uma cobrança pendente
   */
  async cancelCharge(chargeId: string): Promise<PayeraChargeResponse> {
    const response = await fetch(`${this.apiUrl}/charges/${chargeId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "x-api-key": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(
        `Erro ao cancelar cobrança: ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Verifica assinatura do webhook
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret?: string
  ): boolean {
    const webhookSecret = secret || process.env.PAYERA_WEBHOOK_SECRET || "";

    if (!webhookSecret) {
      console.warn("PAYERA_WEBHOOK_SECRET não configurado");
      return false;
    }

    try {
      // Implementar verificação de assinatura conforme documentação da Payera
      // Por exemplo, usando HMAC SHA256
      const crypto = require("crypto");
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");

      return signature === expectedSignature;
    } catch (error) {
      console.error("Erro ao verificar assinatura do webhook:", error);
      return false;
    }
  }
}

export const payeraClient = new PayeraClient();
