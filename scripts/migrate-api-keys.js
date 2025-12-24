/**
 * Script para migração de API keys hasheadas para plaintext
 * 
 * Como não é possível "des-hashear" as chaves antigas,
 * este script desativa todas as chaves existentes.
 * Os usuários precisarão criar novas chaves no painel.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateApiKeys() {
  console.log('🔄 Iniciando migração de API keys...\n');

  try {
    // Desativa todas as chaves existentes
    const result = await prisma.apiKey.updateMany({
      where: { active: true },
      data: { active: false },
    });

    console.log(`✅ ${result.count} chaves desativadas com sucesso!`);
    console.log('\n⚠️  Os usuários precisarão criar novas API keys no painel.');
    console.log('   As novas chaves serão armazenadas em plaintext para exibição.');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateApiKeys();
