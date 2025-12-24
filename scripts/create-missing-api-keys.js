/**
 * Script para criar API keys para usuários que não têm
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateApiKey() {
  const prefix = 'cnpj';
  const randomPart = crypto.randomBytes(32).toString('base64url');
  return `${prefix}_${randomPart}`;
}

async function createMissingApiKeys() {
  console.log('🔄 Criando API keys para usuários sem chave...\n');

  try {
    // Busca todos os usuários
    const users = await prisma.user.findMany({
      include: {
        apiKeys: {
          where: { active: true }
        }
      }
    });

    let created = 0;

    for (const user of users) {
      // Se usuário não tem API key ativa
      if (user.apiKeys.length === 0) {
        const apiKey = generateApiKey();
        
        await prisma.apiKey.create({
          data: {
            userId: user.id,
            key: apiKey,
            name: 'API Key',
            active: true,
          },
        });

        console.log(`✅ API key criada para: ${user.email}`);
        console.log(`   Key: ${apiKey}\n`);
        created++;
      }
    }

    if (created === 0) {
      console.log('✅ Todos os usuários já possuem API keys!');
    } else {
      console.log(`\n✅ ${created} API keys criadas com sucesso!`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante a criação:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingApiKeys();
