import { auth } from "@/lib/auth";
import { paymentService } from "@/services/payment.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/payments/packs
 * Retorna os pacotes de créditos disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log("❌ GET /api/v1/payments/packs - Não autenticado");
      return NextResponse.json(
        { success: false, error: { message: "Não autenticado" } },
        { status: 401 },
      );
    }

    const packs = await paymentService.getAvailablePacks();
    console.log(
      `✅ GET /api/v1/payments/packs - ${packs.length} pacotes encontrados`,
    );

    return NextResponse.json({
      success: true,
      data: { packs },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pacotes:", error);
    return NextResponse.json(
      { success: false, error: { message: "Erro ao buscar pacotes" } },
      { status: 500 },
    );
  }
}
