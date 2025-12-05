import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { creditService } from '@/services/credit.service';
import { CreditType } from '@prisma/client';
import { z } from 'zod';

const addCreditsSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  type: z.nativeEnum(CreditType),
  description: z.string().optional(),
});

// Obter saldo e histórico
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    const [balance, history] = await Promise.all([
      creditService.getBalance(session.user.id),
      creditService.getHistory(session.user.id, 50),
    ]);

    return NextResponse.json({
      success: true,
      data: { balance, history },
    });
  } catch (error) {
    console.error('Erro ao buscar créditos:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao buscar créditos' } },
      { status: 500 }
    );
  }
}

// Adicionar créditos (admin/purchase flow)
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
    const validation = addCreditsSchema.safeParse(body);

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

    await creditService.addCredits(
      session.user.id,
      validation.data.amount,
      validation.data.type,
      validation.data.description || 'Créditos adicionados'
    );

    const newBalance = await creditService.getBalance(session.user.id);

    return NextResponse.json({
      success: true,
      data: { balance: newBalance },
    });
  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao adicionar créditos' } },
      { status: 500 }
    );
  }
}
