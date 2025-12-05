import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Desativar API Key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    // Verifica se a API key pertence ao usuário
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: { message: 'API key não encontrada' } },
        { status: 404 }
      );
    }

    // Desativa a API key
    await prisma.apiKey.update({
      where: { id: params.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar API key:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao deletar API key' } },
      { status: 500 }
    );
  }
}
