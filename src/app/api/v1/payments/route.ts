import { auth } from "@/lib/auth";
import { paymentService } from "@/services/payment.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPaymentSchema = z.object({
  creditPackId: z.string().cuid("ID do pacote inválido"),
});

/**
 * POST /api/v1/payments
 * Cria um novo pagamento para adicionar créditos
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: "Não autenticado" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createPaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Dados inválidos",
            details: validation.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const payment = await paymentService.createPayment({
      userId: session.user.id,
      creditPackId: validation.data.creditPackId,
      userEmail: session.user.email,
      userName: session.user.name || undefined,
    });

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro ao criar pagamento";

    return NextResponse.json(
      { success: false, error: { message: errorMessage } },
      { status: 500 }
    );
  }
}
