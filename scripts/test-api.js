/**
 * Script de teste da API CNPJota
 * 
 * Como usar:
 * 1. Crie uma API key no dashboard
 * 2. Execute: node scripts/test-api.js sua-api-key-aqui
 */

const API_KEY = process.argv[2];
const BASE_URL = process.env.API_URL || 'http://localhost:3000';

if (!API_KEY) {
  console.error('❌ Erro: API key não fornecida');
  console.log('Uso: node scripts/test-api.js sua-api-key-aqui');
  process.exit(1);
}

console.log('🧪 Testando API CNPJota...\n');

async function testCNPJ(cnpj, description) {
  console.log(`\n📋 Teste: ${description}`);
  console.log(`   CNPJ: ${cnpj}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/cnpj/${cnpj}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('   ✅ Sucesso!');
      console.log(`   Razão Social: ${data.data.razaoSocial}`);
      console.log(`   Fonte: (consulte registros ou cache)`);
      console.log(`   Custo: ${data.meta.creditCost} créditos`);
      console.log(`   Créditos restantes: ${data.meta.creditsRemaining}`);
    } else {
      console.log(`   ❌ Erro: ${data.error.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error.message}`);
  }
}

async function testStats() {
  console.log('\n📊 Teste: Estatísticas da conta');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/stats`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('   ✅ Sucesso!');
      console.log(`   Créditos: ${data.data.credits}`);
      console.log(`   Total de consultas: ${data.data.totalQueries}`);
      console.log(`   Consultas recentes: ${data.data.recentQueries.length}`);
    } else {
      console.log(`   ❌ Erro: ${data.error.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error.message}`);
  }
}

async function runTests() {
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`);

  // Teste 1: CNPJ válido
  await testCNPJ('00000000000191', 'CNPJ válido - Banco do Brasil');

  // Teste 2: CNPJ com formatação
  await testCNPJ('00.000.000/0001-91', 'CNPJ formatado');

  // Teste 3: CNPJ inválido
  await testCNPJ('12345678901234', 'CNPJ inválido (deve falhar)');

  // Teste 4: Estatísticas
  await testStats();

  // Teste 5: Cache (mesma consulta)
  await testCNPJ('00000000000191', 'Segunda consulta (deve vir do cache)');

  console.log('\n✨ Testes concluídos!\n');
}

runTests().catch(console.error);
