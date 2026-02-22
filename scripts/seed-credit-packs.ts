import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedCreditPacks() {
  console.log("🌱 Seeding credit packs...");

  const packs = [
    {
      name: "SMALL",
      displayName: "Pacote Básico",
      credits: parseFloat(process.env.CREDIT_PACK_SMALL_AMOUNT || "100"),
      price: parseInt(process.env.CREDIT_PACK_SMALL_PRICE || "1000", 10),
      description: "Ideal para começar",
      active: true,
    },
    {
      name: "MEDIUM",
      displayName: "Pacote Intermediário",
      credits: parseFloat(process.env.CREDIT_PACK_MEDIUM_AMOUNT || "500"),
      price: parseInt(process.env.CREDIT_PACK_MEDIUM_PRICE || "4500", 10),
      description: "Melhor custo-benefício",
      active: true,
    },
    {
      name: "LARGE",
      displayName: "Pacote Premium",
      credits: parseFloat(process.env.CREDIT_PACK_LARGE_AMOUNT || "1000"),
      price: parseInt(process.env.CREDIT_PACK_LARGE_PRICE || "8000", 10),
      description: "Para uso intensivo",
      active: true,
    },
  ];

  for (const pack of packs) {
    await prisma.creditPack.upsert({
      where: { name: pack.name },
      update: pack,
      create: pack,
    });
    console.log(
      `✓ Created/Updated pack: ${pack.name} - ${pack.credits} créditos por ${
        pack.price / 100
      } BRL`
    );
  }

  console.log("✅ Credit packs seeded successfully!");
}

async function main() {
  try {
    await seedCreditPacks();
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
