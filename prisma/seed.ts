import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar planos
  const basicPlan = await prisma.plan.upsert({
    where: { name: "basic" },
    update: {},
    create: {
      name: "basic",
      displayName: "Plano Básico",
      creditCost: 0.33,
      maxRequestsPerSecond: 2,
      description: "Ideal para começar. 0.33 créditos por consulta.",
      active: true,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: "pro" },
    update: {},
    create: {
      name: "pro",
      displayName: "Plano Profissional",
      creditCost: 0.25,
      maxRequestsPerSecond: 5,
      description: "Para uso profissional. 0.25 créditos por consulta.",
      active: true,
    },
  });

  const businessPlan = await prisma.plan.upsert({
    where: { name: "business" },
    update: {},
    create: {
      name: "business",
      displayName: "Plano Empresarial",
      creditCost: 0.2,
      maxRequestsPerSecond: 10,
      description: "Para empresas. 0.20 créditos por consulta.",
      active: true,
    },
  });

  console.log("✅ Planos criados:", {
    basicPlan,
    proPlan,
    businessPlan,
  });

  // Criar pacotes de crédito
  const smallPack = await prisma.creditPack.upsert({
    where: { name: "SMALL" },
    update: {
      displayName: "Pacote Básico",
      credits: 100,
      price: 1000, // R$ 10,00 = 100 centavos * 10
      description: "Ideal para começar",
      active: true,
    },
    create: {
      name: "SMALL",
      displayName: "Pacote Básico",
      credits: 100,
      price: 1000, // R$ 10,00 (R$ 0,10 por crédito)
      description: "Ideal para começar",
      active: true,
    },
  });

  const mediumPack = await prisma.creditPack.upsert({
    where: { name: "MEDIUM" },
    update: {
      displayName: "Pacote Intermediário",
      credits: 500,
      price: 4500, // R$ 45,00 (R$ 0,09 por crédito - 10% desconto)
      description: "Melhor custo-benefício",
      active: true,
    },
    create: {
      name: "MEDIUM",
      displayName: "Pacote Intermediário",
      credits: 500,
      price: 4500, // R$ 45,00 (R$ 0,09 por crédito - 10% desconto)
      description: "Melhor custo-benefício",
      active: true,
    },
  });

  const largePack = await prisma.creditPack.upsert({
    where: { name: "LARGE" },
    update: {
      displayName: "Pacote Premium",
      credits: 1000,
      price: 8000, // R$ 80,00 (R$ 0,08 por crédito - 20% desconto)
      description: "Para uso intensivo",
      active: true,
    },
    create: {
      name: "LARGE",
      displayName: "Pacote Premium",
      credits: 1000,
      price: 8000, // R$ 80,00 (R$ 0,08 por crédito - 20% desconto)
      description: "Para uso intensivo",
      active: true,
    },
  });

  console.log("✅ Pacotes de crédito criados:", {
    smallPack,
    mediumPack,
    largePack,
  });

  console.log("🎉 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
