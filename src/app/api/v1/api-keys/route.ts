import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateApiKey } from '@/lib/crypto';
import { z } from 'zod';

const createApiKeySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
});

// Listar API Keys do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        active: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: apiKeys });
  } catch (error) {
    console.error('Erro ao listar API keys:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao listar API keys' } },
      { status: 500 }
    );
  }
}

// Criar nova API Key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createApiKeySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Dados inválidos',
            details: validation.error.errors,
          },
        },
        { status: 400 }
      );
    }

    // Gera API key
    const apiKey = generateApiKey();

    // Salva no banco (plaintext para exibição no painel)
    const apiKeyRecord = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        key: apiKey,
        name: validation.data.name,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: apiKeyRecord.id,
        key: apiKeyRecord.key,
        name: apiKeyRecord.name,
        createdAt: apiKeyRecord.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro ao criar API key:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao criar API key' } },
      { status: 500 }
    );
  }
}
