import { prisma } from '@/lib/prisma';
import { InsufficientCreditsError } from '@/types/errors';
import { CreditType } from '@prisma/client';

export class CreditService {
  /**
   * Obtém saldo atual de créditos do usuário
   */
  async getBalance(userId: string): Promise<number> {
    const result = await prisma.credit.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  /**
   * Verifica se usuário tem créditos suficientes
   */
  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= required;
  }

  /**
   * Deduz créditos do usuário
   */
  async deductCredits(
    userId: string,
    amount: number,
    description: string
  ): Promise<void> {
    const hasCredits = await this.hasEnoughCredits(userId, amount);

    if (!hasCredits) {
      throw new InsufficientCreditsError(
        `Créditos insuficientes. Necessário: ${amount.toFixed(2)}`
      );
    }

    await prisma.credit.create({
      data: {
        userId,
        amount: -amount,
        type: CreditType.DEDUCTION,
        description,
      },
    });
  }

  /**
   * Adiciona créditos ao usuário
   */
  async addCredits(
    userId: string,
    amount: number,
    type: CreditType,
    description: string
  ): Promise<void> {
    await prisma.credit.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    });
  }

  /**
   * Obtém histórico de créditos
   */
  async getHistory(userId: string, limit: number = 50) {
    return prisma.credit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Calcula custo de requisição baseado no plano
   */
  async calculateCost(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user || !user.plan) {
      // Plano básico padrão
      return 0.33;
    }

    return user.plan.creditCost;
  }
}

export const creditService = new CreditService();
