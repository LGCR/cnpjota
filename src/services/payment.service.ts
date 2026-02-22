import { PayeraCharge, payeraClient } from "@/lib/payment-client";
import { prisma } from "@/lib/prisma";
import { CreditType, TransactionStatus } from "@prisma/client";
import { creditService } from "./credit.service";

export interface CreditPackOption {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  price: number; // em centavos
  priceFormatted: string;
  description?: string;
}

export interface CreatePaymentParams {
  userId: string;
  creditPackId: string;
  userEmail: string;
  userName?: string;
}

export interface PaymentResult {
  transactionId: string;
  paymentLink: string;
  credits: number;
  price: number;
}

export class PaymentService {
  /**
   * Obtém os pacotes de créditos disponíveis
   */
  async getAvailablePacks(): Promise<CreditPackOption[]> {
    const packs = await prisma.creditPack.findMany({
      where: { active: true },
      orderBy: { credits: "asc" },
    });

    return packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      displayName: pack.displayName,
      credits: pack.credits,
      price: pack.price,
      priceFormatted: this.formatPrice(pack.price),
      description: pack.description || undefined,
    }));
  }

  /**
   * Cria um pagamento para adicionar créditos
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const { userId, creditPackId, userEmail, userName } = params;

    // Buscar pacote de créditos
    const creditPack = await prisma.creditPack.findUnique({
      where: { id: creditPackId },
    });

    if (!creditPack || !creditPack.active) {
      throw new Error("Pacote de créditos não encontrado ou inativo");
    }

    // Criar transação pendente
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        creditPackId,
        status: TransactionStatus.PENDING,
        amount: creditPack.credits,
        price: creditPack.price,
        metadata: {
          creditPackName: creditPack.name,
        },
      },
    });

    try {
      // Criar cobrança na Payera
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const charge: PayeraCharge = {
        value: creditPack.price,
        description: `Compra de ${creditPack.credits} créditos - ${creditPack.displayName}`,
        // customer: {
        //   name: userName || userEmail,
        //   email: userEmail,
        // },
        expiresIn: 3, // 3 dias
        metadata: {
          transactionId: transaction.id,
          userId,
          creditPackId,
          credits: creditPack.credits,
        },
        redirectUrl: `${baseUrl}/dashboard?payment=success&transaction=${transaction.id}`,
        webhookUrl: `${baseUrl}/api/webhooks/payera`,
      };

      const payeraCharge = await payeraClient.createCharge(charge);

      // Atualizar transação com dados da Payera
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          payeraChargeId: payeraCharge.id,
          paymentLink: payeraCharge.paymentLink,
        },
      });

      return {
        transactionId: transaction.id,
        paymentLink: payeraCharge.paymentLink,
        credits: creditPack.credits,
        price: creditPack.price,
      };
    } catch (error) {
      // Em caso de erro, cancelar transação
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.CANCELLED },
      });

      throw error;
    }
  }

  /**
   * Processa pagamento confirmado via webhook
   */
  async processPaymentSuccess(payeraChargeId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { payeraChargeId },
      include: { user: true },
    });

    if (!transaction) {
      throw new Error(
        `Transação não encontrada para chargeId: ${payeraChargeId}`,
      );
    }

    // Verificar se já foi processado
    if (transaction.status === TransactionStatus.PAID) {
      console.log(
        `Transação ${transaction.id} já foi processada anteriormente`,
      );
      return;
    }

    // Atualizar status da transação
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TransactionStatus.PAID,
        paidAt: new Date(),
      },
    });

    // Adicionar créditos ao usuário
    await creditService.addCredits(
      transaction.userId,
      transaction.amount,
      CreditType.PURCHASE,
      `Compra de créditos - Transação ${transaction.id}`,
    );

    // Atualizar a relação entre Credit e Transaction
    const credit = await prisma.credit.findFirst({
      where: {
        userId: transaction.userId,
        amount: transaction.amount,
        type: CreditType.PURCHASE,
      },
      orderBy: { createdAt: "desc" },
    });

    if (credit) {
      await prisma.credit.update({
        where: { id: credit.id },
        data: { transactionId: transaction.id },
      });
    }

    console.log(
      `Pagamento processado com sucesso. Transação: ${transaction.id}, ` +
        `Usuário: ${transaction.userId}, Créditos: ${transaction.amount}`,
    );
  }

  /**
   * Processa pagamento expirado via webhook
   */
  async processPaymentExpired(payeraChargeId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { payeraChargeId },
    });

    if (!transaction) {
      throw new Error(
        `Transação não encontrada para chargeId: ${payeraChargeId}`,
      );
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      console.log(`Transação ${transaction.id} não está pendente`);
      return;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TransactionStatus.EXPIRED,
        expiredAt: new Date(),
      },
    });

    console.log(`Pagamento expirado. Transação: ${transaction.id}`);
  }

  /**
   * Processa pagamento cancelado via webhook
   */
  async processPaymentCancelled(payeraChargeId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { payeraChargeId },
    });

    if (!transaction) {
      throw new Error(
        `Transação não encontrada para chargeId: ${payeraChargeId}`,
      );
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      console.log(`Transação ${transaction.id} não está pendente`);
      return;
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TransactionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    console.log(`Pagamento cancelado. Transação: ${transaction.id}`);
  }

  /**
   * Obtém histórico de transações do usuário
   */
  async getUserTransactions(userId: string, limit: number = 20) {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        creditPack: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Formata preço de centavos para string
   */
  private formatPrice(priceInCents: number): string {
    const price = priceInCents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }
}

export const paymentService = new PaymentService();
