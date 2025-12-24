import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { CreditType } from "@prisma/client"
import { generateApiKey } from "@/lib/crypto"

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
      return true;
    },
  },
  events: {
    async createUser(message) {
      const userId = message.user.id as string;
      
      console.log('🔵 [AUTH] Novo usuário criado:', userId, message.user.email);
      
      try {
        // Busca ou cria plano básico
        let basicPlan = await prisma.plan.findUnique({
          where: { name: 'basic' },
        });

        if (!basicPlan) {
          console.log('⚠️  [AUTH] Plano básico não existe, criando...');
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

        console.log('✅ [AUTH] Plano básico encontrado:', basicPlan.id);

        // Atualiza usuário com plano básico
        await prisma.user.update({
          where: { id: userId },
          data: { planId: basicPlan.id },
        });

        console.log('✅ [AUTH] Usuário atualizado com plano');

        // Adiciona créditos de boas-vindas
        await prisma.credit.create({
          data: {
            userId: userId,
            amount: 100,
            type: CreditType.BONUS,
            description: 'Bônus de boas-vindas',
          },
        });

        console.log('✅ [AUTH] 100 créditos adicionados');

        // Cria API key automaticamente
        const apiKey = generateApiKey();
        await prisma.apiKey.create({
          data: {
            userId: userId,
            key: apiKey,
            name: 'API Key',
          },
        });

        console.log('✅ [AUTH] API key criada:', apiKey);
      } catch (error) {
        console.error('❌ [AUTH] Erro ao configurar novo usuário:', error);
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
})
