import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { CreditType } from "@prisma/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Quando um novo usuário se registra, dar créditos de boas-vindas
      if (account?.provider && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { credits: true },
        });

        // Se é novo usuário (sem créditos ainda)
        if (existingUser && existingUser.credits.length === 0) {
          // Busca ou cria plano básico
          let basicPlan = await prisma.plan.findUnique({
            where: { name: 'basic' },
          });

          if (!basicPlan) {
            basicPlan = await prisma.plan.create({
              data: {
                name: 'basic',
                displayName: 'Plano Básico',
                creditCost: 0.33,
                maxRequestsPerSecond: 2,
                description: 'Plano básico para iniciantes',
              },
            });
          }

          // Atualiza usuário com plano básico
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { planId: basicPlan.id },
          });

          // Adiciona créditos de boas-vindas
          await prisma.credit.create({
            data: {
              userId: existingUser.id,
              amount: 100, // 100 créditos iniciais (~300 consultas)
              type: CreditType.BONUS,
              description: 'Bônus de boas-vindas',
            },
          });
        }
      }

      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
})
