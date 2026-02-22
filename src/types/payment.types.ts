/**
 * Tipos relacionados ao sistema de pagamentos
 */

import { TransactionStatus } from "@prisma/client";

export interface PaymentSuccessParams {
  transactionId: string;
}

export interface CreatePaymentRequest {
  creditPackId: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data?: {
    transactionId: string;
    paymentLink: string;
    credits: number;
    price: number;
  };
  error?: {
    message: string;
    details?: any;
  };
}

export interface GetPacksResponse {
  success: boolean;
  data?: {
    packs: CreditPackDto[];
  };
  error?: {
    message: string;
  };
}

export interface CreditPackDto {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  price: number;
  priceFormatted: string;
  description?: string;
}

export interface TransactionDto {
  id: string;
  payeraChargeId: string;
  paymentLink: string;
  status: TransactionStatus;
  amount: number;
  price: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  paidAt?: Date | string | null;
  expiredAt?: Date | string | null;
  cancelledAt?: Date | string | null;
  creditPack?: {
    id: string;
    displayName: string;
    name: string;
  };
}

export interface GetTransactionHistoryResponse {
  success: boolean;
  data?: {
    transactions: TransactionDto[];
  };
  error?: {
    message: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  error?: {
    message: string;
  };
}
