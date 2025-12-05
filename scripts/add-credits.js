const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCredits() {
  const email = process.argv[2];
  const amount = parseFloat(process.argv[3]);

  if (!email || !amount) {
    console.error('❌ Uso: node scripts/add-credits.js usuario@email.com 100');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Usuário com email ${email} não encontrado`);
      process.exit(1);
    }

    await prisma.credit.create({
      data: {
        userId: user.id,
        amount,
        type: 'BONUS',
        description: 'Créditos adicionados manualmente via script',
      },
    });

    const balance = await prisma.credit.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    });

    console.log(`✅ ${amount} créditos adicionados para ${email}`);
    console.log(`💰 Novo saldo: ${balance._sum.amount || 0} créditos`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addCredits();
