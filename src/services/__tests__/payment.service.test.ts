/**
 * Testes básicos para Payment Service
 *
 * Para executar: npm test -- payment.service.test.ts
 */

import { prisma } from "@/lib/prisma";
import { paymentService } from "@/services/payment.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock do prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    creditPack: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    credit: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock do payera client
vi.mock("@/lib/payera-client", () => ({
  payeraClient: {
    createCharge: vi.fn(),
  },
}));

describe("PaymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAvailablePacks", () => {
    it("deve retornar pacotes de créditos ativos", async () => {
      const mockPacks = [
        {
          id: "1",
          name: "SMALL",
          displayName: "Pacote Básico",
          credits: 100,
          price: 1000,
          description: "Teste",
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.creditPack.findMany as any).mockResolvedValue(mockPacks);

      const result = await paymentService.getAvailablePacks();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "1",
        name: "SMALL",
        credits: 100,
        price: 1000,
      });
      expect(result[0].priceFormatted).toBe("R$ 10,00");
    });
  });

  describe("formatPrice", () => {
    it("deve formatar preço corretamente", () => {
      const service = paymentService as any;

      expect(service.formatPrice(1000)).toBe("R$ 10,00");
      expect(service.formatPrice(4500)).toBe("R$ 45,00");
      expect(service.formatPrice(8000)).toBe("R$ 80,00");
    });
  });
});
