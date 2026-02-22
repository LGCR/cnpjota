import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creditService } from "@/services/credit.service";
import { redirect } from "next/navigation";
import DashboardModern from "./dashboard-modern";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Busca dados do usuário
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      apiKeys: {
        where: { active: true },
        select: {
          id: true,
          name: true,
          key: true,
          lastUsedAt: true,
          createdAt: true,
        },
        take: 1, // Apenas uma chave
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Busca estatísticas
  const [credits, totalQueries] = await Promise.all([
    creditService.getBalance(user.id),
    prisma.cnpjQuery.count({
      where: { userId: user.id, success: true },
    }),
  ]);

  return (
    <DashboardModern
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      stats={{
        credits,
        totalQueries,
      }}
      apiKey={user.apiKeys[0] || null}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
    />
  );
}
