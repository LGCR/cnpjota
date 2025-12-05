import { RateLimitError } from '@/types/errors';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpa entradas expiradas a cada minuto
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Verifica se pode fazer requisição e incrementa contador
   */
  async checkLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number = 1000 // 1 segundo padrão
  ): Promise<void> {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetAt) {
      // Nova janela de tempo
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      throw new RateLimitError(
        `Limite de ${maxRequests} requisições por segundo excedido. Tente novamente em ${retryAfter}s.`
      );
    }

    entry.count++;
  }

  /**
   * Remove entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Limpa rate limit de um identificador específico
   */
  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Destrói o rate limiter
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.limits.clear();
  }
}

export const rateLimiter = new RateLimiter();
