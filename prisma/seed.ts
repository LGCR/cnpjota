import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar planos
  const basicPlan = await prisma.plan.upsert({
    where: { name: 'basic' },
    update: {},
    create: {
      name: 'basic',
      displayName: 'Plano Básico',
      creditCost: 0.33,
      maxRequestsPerSecond: 2,
      description: 'Ideal para começar. 0.33 créditos por consulta.',
      active: true,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      displayName: 'Plano Profissional',
      creditCost: 0.25,
      maxRequestsPerSecond: 5,
      description: 'Para uso profissional. 0.25 créditos por consulta.',
      active: true,
    },
  });

  const businessPlan = await prisma.plan.upsert({
    where: { name: 'business' },
    update: {},
    create: {
      name: 'business',
      displayName: 'Plano Empresarial',
      creditCost: 0.20,
      maxRequestsPerSecond: 10,
      description: 'Para empresas. 0.20 créditos por consulta.',
      active: true,
    },
  });

  console.log('✅ Planos criados:', {
    basicPlan,
    proPlan,
    businessPlan,
  });

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
