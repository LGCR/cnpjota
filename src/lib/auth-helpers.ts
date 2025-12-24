import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { UnauthorizedError } from '@/types/errors';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  planId: string;
}

/**
 * Extrai e valida API key do header Authorization
 */
export async function validateApiKey(request: NextRequest): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('API key não fornecida');
  }

  const apiKey = authHeader.replace('Bearer ', '');

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey, active: true },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          planId: true,
        },
      },
    },
  });

  if (!apiKeyRecord) {
    throw new UnauthorizedError('API key inválida');
  }

  // Atualiza último uso
  await prisma.apiKey.update({
    where: { id: apiKeyRecord.id },
    data: { lastUsedAt: new Date() },
  });

  return apiKeyRecord.user;
}
