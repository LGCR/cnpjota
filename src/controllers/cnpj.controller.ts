import { NextRequest } from 'next/server';
import { cnpjService } from '@/services/cnpj.service';
import { creditService } from '@/services/credit.service';
import { cnpjRepository } from '@/repositories/cnpj.repository';
import { rateLimiter } from '@/lib/rate-limiter';
import { validateApiKey } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types/api.types';
import { CnpjResponseDto } from '@/types/cnpj.dto';

export class CnpjController {
  /**
   * Endpoint principal de consulta de CNPJ
   */
  async lookup(request: NextRequest): Promise<ApiResponse<CnpjResponseDto>> {
    try {
      // 1. Autenticação via API Key
      const user = await validateApiKey(request);

      // 2. Extrai CNPJ da URL
      const url = new URL(request.url);
      const cnpj = url.pathname.split('/').pop();

      if (!cnpj) {
        return {
          success: false,
          error: { message: 'CNPJ não fornecido' },
        };
      }

      // 3. Busca plano e configurações do usuário
      const userWithPlan = await prisma.user.findUnique({
        where: { id: user.id },
        include: { plan: true },
      });

      if (!userWithPlan || !userWithPlan.plan) {
        return {
          success: false,
          error: { message: 'Plano do usuário não encontrado' },
        };
      }

      // 4. Rate limiting
      await rateLimiter.checkLimit(
        user.id,
        userWithPlan.plan.maxRequestsPerSecond,
        1000
      );

      // 5. Calcula custo da requisição
      const creditCost = await creditService.calculateCost(user.id);

      // 6. Verifica créditos
      const hasCredits = await creditService.hasEnoughCredits(user.id, creditCost);
      
      if (!hasCredits) {
        return {
          success: false,
          error: {
            message: 'Créditos insuficientes',
            code: 'INSUFFICIENT_CREDITS',
          },
          meta: {
            timestamp: new Date().toISOString(),
            creditCost,
            creditsRemaining: await creditService.getBalance(user.id),
          },
        };
      }

      // 7. Consulta CNPJ
      const { data, fromCache } = await cnpjService.lookup(cnpj);

      // 8. Deduz créditos
      await creditService.deductCredits(
        user.id,
        creditCost,
        `Consulta CNPJ: ${cnpj}`
      );

      // 9. Registra consulta
      const cnpjData = await cnpjRepository.findByCnpj(cnpj.replace(/\D/g, ''));
      await cnpjRepository.logQuery(
        user.id,
        cnpj.replace(/\D/g, ''),
        cnpjData?.id || null,
        creditCost,
        fromCache ? 'cache' : (cnpjData?.source || 'unknown'),
        true
      );

      // 10. Retorna resultado
      const creditsRemaining = await creditService.getBalance(user.id);

      return {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          creditCost,
          creditsRemaining,
        },
      };
    } catch (error) {
      console.error('Erro no CnpjController.lookup:', error);

      if (error instanceof Error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.name,
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Busca dados do usuário logado
   */
  async getStats(request: NextRequest): Promise<ApiResponse> {
    try {
      const user = await validateApiKey(request);

      // Busca estatísticas
      const [credits, totalQueries, recentQueries] = await Promise.all([
        creditService.getBalance(user.id),
        prisma.cnpjQuery.count({ where: { userId: user.id, success: true } }),
        prisma.cnpjQuery.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            cnpj: true,
            source: true,
            creditCost: true,
            createdAt: true,
            success: true,
          },
        }),
      ]);

      return {
        success: true,
        data: {
          credits,
          totalQueries,
          recentQueries,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: { message: error.message },
        };
      }

      return {
        success: false,
        error: { message: 'Erro ao buscar estatísticas' },
      };
    }
  }
}

export const cnpjController = new CnpjController();
