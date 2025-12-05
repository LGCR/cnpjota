import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import DashboardClient from './dashboard-client';
import { prisma } from '@/lib/prisma';
import { creditService } from '@/services/credit.service';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Busca dados do usuário
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      plan: true,
      apiKeys: {
        where: { active: true },
        select: {
          id: true,
          name: true,
          lastUsedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Busca estatísticas
  const [credits, totalQueries] = await Promise.all([
    creditService.getBalance(user.id),
    prisma.cnpjQuery.count({
      where: { userId: user.id, success: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">CNPJota</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <Button variant="outline" type="submit">
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient
          user={{
            name: user.name,
            email: user.email,
            plan: user.plan,
          }}
          stats={{
            credits,
            totalQueries,
          }}
          apiKeys={user.apiKeys}
        />
      </main>
    </div>
  );
}
