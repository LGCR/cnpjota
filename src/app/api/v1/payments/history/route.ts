import { auth } from "@/lib/auth";
import { paymentService } from "@/services/payment.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/payments/history
 * Retorna o histórico de transações do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Não autenticado" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const transactions = await paymentService.getUserTransactions(
      session.user.id,
      limit
    );

    return NextResponse.json({
      success: true,
      data: { transactions },
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json(
      { success: false, error: { message: "Erro ao buscar histórico" } },
      { status: 500 }
    );
  }
}
