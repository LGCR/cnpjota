/**
 * Cliente ClickPay via SDK oficial (@clickpay/sdk)
 * Alternativa ao payera-client.ts que usa fetch direto.
 *
 * O SDK é carregado com require() para evitar que o Turbopack (Next.js 16)
 * tente fazer bundle de um módulo symlinked fora do projeto.
 * O Node.js resolve o symlink normalmente em runtime.
 */

// ──────────────────────────────────────────────
// Tipos locais espelhando o @clickpay/sdk
// (sem importar o pacote estaticamente)
// ──────────────────────────────────────────────

interface SdkCustomerInput {
  taxId: string;
  name: string;
  email: string;
  phone: string;
  postalCode?: string;
  address?: string;
  district?: string;
  number?: string;
  line1?: string;
}

interface SdkCreatePaymentLinkInput {
  total?: number;
  customerId?: string;
  customer?: SdkCustomerInput;
  successUrl?: string;
  failedUrl?: string;
  needShipping?: boolean;
  notifyCustomer?: boolean;
  devMode?: boolean;
  externalId?: string;
  items?: { productId: string; quantity?: number }[];
}

interface SdkCreatePixChargeInput {
  amount: number;
  customer: SdkCustomerInput;
  expiresIn?: number;
  externalId?: string;
  devMode?: boolean;
}

interface SdkProcessPixForChargeInput {
  customer: SdkCustomerInput;
}

interface SdkPaymentLinkResponse {
  id: string;
  externalId?: string;
  url: string;
  devMode: boolean;
  total: number;
}

interface SdkPixChargeResponse {
  id: string;
  status: string;
  amount: number;
  brCode: string;
  brCodeBase64: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  externalId?: string;
  devMode: boolean;
}

interface SdkPixPaymentResponse {
  id: string;
  status: string;
  amount: number;
  brCode: string;
  brCodeBase64: string;
  platformFee?: number;
  createdAt: string;
  expiresAt: string;
  externalId?: string;
}

interface SdkChargeDetail {
  id: string;
  total: number;
  url: string;
  status: string;
  paymentStatus: string;
  paymentDate?: string;
  successUrl?: string;
  failedUrl?: string;
  devMode: boolean;
  needShipping: boolean;
  brCode?: string;
  brCodeBase64?: string;
  expiresAt?: string;
  externalId?: string;
  customer?: {
    id?: string;
    taxId?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface SdkApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

interface SdkChargesResource {
  createPaymentLink(
    input: SdkCreatePaymentLinkInput,
    options?: { idempotencyKey?: string },
  ): Promise<SdkApiResponse<SdkPaymentLinkResponse>>;
  createPixCharge(
    input: SdkCreatePixChargeInput,
    options?: { idempotencyKey?: string },
  ): Promise<SdkApiResponse<SdkPixChargeResponse>>;
  getById(chargeId: string): Promise<SdkApiResponse<SdkChargeDetail>>;
  generatePixForCharge(
    chargeId: string,
    input: SdkProcessPixForChargeInput,
  ): Promise<SdkApiResponse<SdkPixPaymentResponse>>;
  simulatePayment(chargeId: string): Promise<SdkApiResponse<void>>;
}

interface SdkClickpayInstance {
  charges: SdkChargesResource;
}

interface SdkClickpayConstructor {
  new (options: {
    apiKey?: string;
    accessToken?: string;
    baseUrl?: string;
    sandbox?: boolean;
    timeout?: number;
    maxRetries?: number;
    headers?: Record<string, string>;
  }): SdkClickpayInstance;
}

interface SdkModule {
  Clickpay: SdkClickpayConstructor;
  PaymentStatus: {
    PAID: string;
    RECEIVED: string;
    EXPIRED: string;
    PENDING: string;
    PROCESSING: string;
  };
  ChargeStatus: { OPEN: string; COMPLETED: string; EXPIRED: string };
}

// ── SDK carregado em runtime (sem análise estática pelo Turbopack) ──────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const clickpaySdk: SdkModule = require("@clickpay/sdk");

const { Clickpay, PaymentStatus, ChargeStatus } = clickpaySdk;

// ──────────────────────────────────────────────
// Tipos compartilhados (compatíveis com payera-client.ts)
// ──────────────────────────────────────────────

export interface PayeraCustomer {
  name: string;
  email: string;
  taxId?: string;
  phone?: string;
}

export interface PayeraCharge {
  /** Valor em centavos (ex: 5000 = R$ 50,00). Mínimo: 500 centavos. */
  value: number;
  description?: string;
  customer?: PayeraCustomer;
  /** Expiração em segundos (padrão: 1800 = 30 min). Apenas para PIX direto. */
  expiresIn?: number;
  metadata?: Record<string, any>;
  /** URL de retorno após pagamento bem-sucedido. */
  redirectUrl?: string;
  /** ID externo para rastreabilidade (idempotência). */
  externalId?: string;
  /** Modo sandbox/dev. */
  devMode?: boolean;
}

export interface PayeraChargeResponse {
  id: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  value: number;
  description: string;
  /** URL da página de pagamento. */
  paymentLink: string;
  /** PIX copia-e-cola (brCode). */
  qrCode?: string;
  /** Base64 do QR Code. */
  qrCodeBase64?: string;
  expiresAt: string;
  createdAt: string;
  customer: PayeraCustomer;
  metadata?: Record<string, any>;
}

export interface PayeraPixChargeResponse extends PayeraChargeResponse {
  /** brCode para PIX direto. */
  brCode: string;
  brCodeBase64: string;
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

// ──────────────────────────────────────────────
// Helpers internos
// ──────────────────────────────────────────────

/** Converte o PaymentStatus do SDK para o formato interno. */
function mapPaymentStatus(
  paymentStatus: string,
  chargeStatus: string,
): PayeraChargeResponse["status"] {
  if (
    paymentStatus === PaymentStatus.PAID ||
    paymentStatus === PaymentStatus.RECEIVED
  ) {
    return "PAID";
  }
  if (chargeStatus === ChargeStatus.EXPIRED) return "EXPIRED";
  if (paymentStatus === PaymentStatus.EXPIRED) return "EXPIRED";
  return "PENDING";
}

/** Mapeia ChargeDetail (SDK) → PayeraChargeResponse. */
function mapChargeDetail(detail: SdkChargeDetail): PayeraChargeResponse {
  return {
    id: detail.id,
    status: mapPaymentStatus(detail.paymentStatus, detail.status),
    value: detail.total,
    description: detail.externalId || detail.id,
    paymentLink: detail.url,
    qrCode: detail.brCode,
    qrCodeBase64: detail.brCodeBase64,
    expiresAt: detail.expiresAt || "",
    createdAt: "",
    customer: {
      name: detail.customer?.name || "",
      email: detail.customer?.email || "",
      taxId: detail.customer?.taxId,
      phone: detail.customer?.phone,
    },
  };
}

/** Mapeia PaymentLinkResponse (SDK) → PayeraChargeResponse. */
function mapPaymentLinkResponse(
  res: SdkPaymentLinkResponse,
  input: PayeraCharge,
): PayeraChargeResponse {
  return {
    id: res.id,
    status: "PENDING",
    value: res.total,
    description: input.description || "",
    paymentLink: res.url,
    expiresAt: "",
    createdAt: new Date().toISOString(),
    customer: input.customer || { name: "", email: "" },
    metadata: input.metadata,
  };
}

/** Mapeia PixChargeResponse (SDK) → PayeraPixChargeResponse. */
function mapPixChargeResponse(
  res: SdkPixChargeResponse,
  input: PayeraCharge,
): PayeraPixChargeResponse {
  return {
    id: res.id,
    status: mapPaymentStatus(res.status, ""),
    value: res.amount,
    description: input.description || "",
    paymentLink: res.url,
    qrCode: res.brCode,
    qrCodeBase64: res.brCodeBase64,
    expiresAt: res.expiresAt,
    createdAt: res.createdAt,
    brCode: res.brCode,
    brCodeBase64: res.brCodeBase64,
    customer: input.customer || { name: "", email: "" },
    metadata: input.metadata,
  };
}

// ──────────────────────────────────────────────
// Cliente principal
// ──────────────────────────────────────────────

export interface ClickpayClientOptions {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
  sandbox?: boolean;
  timeout?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
  webhookSecret?: string;
}

export class ClickpayClient {
  private sdk: SdkClickpayInstance;
  private webhookSecret: string;

  constructor(options?: ClickpayClientOptions) {
    const apiKey =
      options?.apiKey ||
      process.env.CLICKPAY_API_KEY ||
      process.env.PAYERA_API_KEY ||
      "";
    const baseUrl =
      options?.baseUrl ||
      process.env.CLICKPAY_API_URL ||
      process.env.PAYERA_API_URL;
    const sandbox = options?.sandbox ?? process.env.NODE_ENV !== "production";

    if (!apiKey) {
      throw new Error(
        "ClickPay API Key é obrigatória. Defina CLICKPAY_API_KEY no .env",
      );
    }

    this.webhookSecret =
      options?.webhookSecret ||
      process.env.CLICKPAY_WEBHOOK_SECRET ||
      process.env.PAYERA_WEBHOOK_SECRET ||
      "";

    this.sdk = new Clickpay({
      apiKey,
      ...(baseUrl ? { baseUrl } : { sandbox }),
      ...options,
    });
  }

  // ── Acesso ao SDK bruto (para uso avançado) ─────────────────────────────

  /** Instância do SDK @clickpay/sdk para operações avançadas. */
  get raw(): SdkClickpayInstance {
    return this.sdk;
  }

  // ── Cobranças ──────────────────────────────────────────────────────────

  /**
   * Cria um link de pagamento (checkout page).
   *
   * Este é o método principal para gerar uma cobrança via ClickPay.
   * O cliente acessa a URL retornada para completar o pagamento.
   *
   * @example
   * const charge = await clickpayClient.createCharge({
   *   value: 5000, // R$ 50,00
   *   customer: { name: 'João Silva', email: 'joao@email.com', taxId: '12345678900', phone: '11999999999' },
   *   redirectUrl: 'https://meusite.com/sucesso',
   * });
   * console.log(charge.paymentLink); // URL da página de pagamento
   */
  async createCharge(charge: PayeraCharge): Promise<PayeraChargeResponse> {
    const input: SdkCreatePaymentLinkInput = {
      total: charge.value,
      successUrl: charge.redirectUrl,
      externalId:
        charge.externalId || (charge.metadata?.id as string | undefined),
      devMode: charge.devMode,
    };

    if (charge.customer) {
      input.customer = {
        name: charge.customer.name,
        email: charge.customer.email,
        taxId: charge.customer.taxId || "",
        phone: charge.customer.phone || "",
      };
    }

    const response = await this.sdk.charges.createPaymentLink(input);

    if (!response.data) {
      throw new Error(`Erro ao criar cobrança: ${response.message}`);
    }

    return mapPaymentLinkResponse(response.data, charge);
  }

  /**
   * Cria uma cobrança PIX direta (sem página de checkout).
   *
   * Retorna o brCode (copia-e-cola) e QR Code para pagamento imediato.
   *
   * @example
   * const pix = await clickpayClient.createPixCharge({
   *   value: 1500, // R$ 15,00
   *   customer: { name: 'Maria', email: 'maria@email.com', taxId: '12345678900', phone: '11999999999' },
   *   expiresIn: 900, // 15 minutos
   * });
   * console.log(pix.brCode); // PIX copia-e-cola
   */
  async createPixCharge(
    charge: PayeraCharge,
  ): Promise<PayeraPixChargeResponse> {
    if (!charge.customer?.taxId || !charge.customer?.phone) {
      throw new Error("PIX direto requer taxId e phone do cliente");
    }

    const input: SdkCreatePixChargeInput = {
      amount: charge.value,
      customer: {
        name: charge.customer.name,
        email: charge.customer.email,
        taxId: charge.customer.taxId,
        phone: charge.customer.phone,
      },
      expiresIn: charge.expiresIn,
      externalId:
        charge.externalId || (charge.metadata?.id as string | undefined),
      devMode: charge.devMode,
    };

    const response = await this.sdk.charges.createPixCharge(input);

    if (!response.data) {
      throw new Error(`Erro ao criar cobrança PIX: ${response.message}`);
    }

    return mapPixChargeResponse(response.data, charge);
  }

  /**
   * Consulta uma cobrança existente pelo ID.
   */
  async getCharge(chargeId: string): Promise<PayeraChargeResponse> {
    const response = await this.sdk.charges.getById(chargeId);

    if (!response.data) {
      throw new Error(`Cobrança não encontrada: ${chargeId}`);
    }

    return mapChargeDetail(response.data);
  }

  /**
   * Gera o QR Code PIX para uma cobrança de link de pagamento existente.
   *
   * Necessário quando o cliente escolhe pagar via PIX em uma cobrança criada com createCharge().
   */
  async generatePixForCharge(
    chargeId: string,
    customer: PayeraCustomer,
  ): Promise<PayeraChargeResponse> {
    if (!customer.taxId || !customer.phone) {
      throw new Error("taxId e phone são obrigatórios para gerar PIX");
    }

    const response = await this.sdk.charges.generatePixForCharge(chargeId, {
      customer: {
        name: customer.name,
        email: customer.email,
        taxId: customer.taxId,
        phone: customer.phone,
      },
    });

    if (!response.data) {
      throw new Error(
        `Erro ao gerar PIX para cobrança ${chargeId}: ${response.message}`,
      );
    }

    const data = response.data;
    return {
      id: data.id,
      status: mapPaymentStatus(data.status, ""),
      value: data.amount,
      description: "",
      paymentLink: "",
      qrCode: data.brCode,
      qrCodeBase64: data.brCodeBase64,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
      customer,
    };
  }

  /**
   * Simula um pagamento (apenas para cobranças criadas com devMode: true).
   * Útil durante desenvolvimento e testes.
   */
  async simulatePayment(chargeId: string): Promise<void> {
    await this.sdk.charges.simulatePayment(chargeId);
  }

  // ── Webhooks ───────────────────────────────────────────────────────────

  /**
   * Verifica a assinatura HMAC-SHA256 de um evento webhook recebido.
   *
   * @param payload - Corpo bruto da requisição (string JSON)
   * @param signature - Valor do header de assinatura (`x-signature` ou similar)
   * @param secret - Segredo opcional (usa CLICKPAY_WEBHOOK_SECRET do .env por padrão)
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret?: string,
  ): boolean {
    const webhookSecret = secret || this.webhookSecret;

    if (!webhookSecret) {
      console.warn("[ClickpayClient] CLICKPAY_WEBHOOK_SECRET não configurado");
      return false;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const crypto = require("crypto") as typeof import("crypto");
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");
      return signature === expected;
    } catch (error) {
      console.error(
        "[ClickpayClient] Erro ao verificar assinatura do webhook:",
        error,
      );
      return false;
    }
  }

  /**
   * Interpreta e valida o corpo de um evento webhook da ClickPay.
   *
   * @throws {Error} Se o payload não corresponder ao formato esperado.
   */
  parseWebhookPayload(body: unknown): PayeraWebhookPayload {
    const payload = body as PayeraWebhookPayload;

    if (!payload?.event || !payload?.data) {
      throw new Error(
        "Payload de webhook inválido: campos obrigatórios ausentes",
      );
    }

    return payload;
  }
}

// ──────────────────────────────────────────────
// Instância singleton (lazy — não lança erro no build)
// ──────────────────────────────────────────────

let _instance: ClickpayClient | null = null;

/**
 * Retorna a instância singleton do ClickpayClient.
 *
 * A instância é criada na primeira chamada usando as variáveis de ambiente:
 * - `CLICKPAY_API_KEY` (ou `PAYERA_API_KEY`)
 * - `CLICKPAY_API_URL` (ou `PAYERA_API_URL`) — opcional
 * - `CLICKPAY_WEBHOOK_SECRET` (ou `PAYERA_WEBHOOK_SECRET`) — para webhooks
 */
export function getClickpayClient(): ClickpayClient {
  if (!_instance) {
    _instance = new ClickpayClient();
  }
  return _instance;
}

/**
 * @deprecated Use `getClickpayClient()` para instanciação lazy e segura.
 * Esta exportação direta pode lançar erro se as variáveis de ambiente não estiverem definidas.
 */
export const clickpayClient = new ClickpayClient();
