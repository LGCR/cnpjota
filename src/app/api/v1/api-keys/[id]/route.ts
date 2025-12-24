import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Desativar API Key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    // Verifica se a API key pertence ao usuário
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: id,
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
      where: { id: id },
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

// Regenerar API Key
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: 'Não autenticado' } },
        { status: 401 }
      );
    }

    // Verifica se a API key pertence ao usuário
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        active: true,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: { message: 'API key não encontrada' } },
        { status: 404 }
      );
    }

    if (body.regenerate) {
      // Gera nova chave
      const newKey = `cnpj_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Atualiza a chave existente
      const updatedApiKey = await prisma.apiKey.update({
        where: { id: id },
        data: { key: newKey },
        select: {
          id: true,
          name: true,
          key: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedApiKey
      });
    }

    return NextResponse.json(
      { success: false, error: { message: 'Operação não suportada' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao atualizar API key:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Erro ao atualizar API key' } },
      { status: 500 }
    );
  }
}
