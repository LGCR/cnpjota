#!/usr/bin/env node

/**
 * Script de verificação de instalação do CNPJota
 * 
 * Verifica se todos os arquivos necessários existem e
 * se as configurações básicas estão corretas.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  '.env.example',
  'prisma/schema.prisma',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/prisma.ts',
  'src/lib/auth.ts',
];

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

console.log('🔍 CNPJota - Verificação de Instalação\n');

let hasErrors = false;

// Verificar arquivos
console.log('📁 Verificando arquivos necessários...');
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANDO!`);
    hasErrors = true;
  }
});

// Verificar .env
console.log('\n🔧 Verificando variáveis de ambiente...');
const envExists = fs.existsSync(path.join(process.cwd(), '.env'));

if (!envExists) {
  console.log('  ⚠️  Arquivo .env não encontrado');
  console.log('  💡 Execute: cp .env.example .env');
  hasErrors = true;
} else {
  console.log('  ✅ Arquivo .env existe');
  
  // Ler .env
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
  
  REQUIRED_ENV_VARS.forEach(varName => {
    const regex = new RegExp(`^${varName}=.+$`, 'm');
    if (regex.test(envContent)) {
      console.log(`  ✅ ${varName} está definida`);
    } else {
      console.log(`  ❌ ${varName} - NÃO DEFINIDA!`);
      hasErrors = true;
    }
  });
}

// Verificar node_modules
console.log('\n📦 Verificando dependências...');
const nodeModulesExists = fs.existsSync(path.join(process.cwd(), 'node_modules'));
if (nodeModulesExists) {
  console.log('  ✅ node_modules existe');
} else {
  console.log('  ❌ node_modules não encontrado');
  console.log('  💡 Execute: npm install');
  hasErrors = true;
}

// Verificar Prisma Client
const prismaClientExists = fs.existsSync(
  path.join(process.cwd(), 'node_modules', '.prisma', 'client')
);
if (prismaClientExists) {
  console.log('  ✅ Prisma Client gerado');
} else {
  console.log('  ⚠️  Prisma Client não gerado');
  console.log('  💡 Execute: npx prisma generate');
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Verificação completada COM ERROS');
  console.log('\n📋 Próximos passos:');
  console.log('  1. Corrija os erros acima');
  console.log('  2. Execute: npm install');
  console.log('  3. Configure o arquivo .env');
  console.log('  4. Execute: npx prisma db push');
  console.log('  5. Execute: npm run dev');
  console.log('\n📚 Veja SETUP.md para mais detalhes\n');
  process.exit(1);
} else {
  console.log('✅ Verificação completada com SUCESSO!');
  console.log('\n🚀 Tudo certo! Você pode executar:');
  console.log('  npm run dev');
  console.log('\n📚 Acesse: http://localhost:3000\n');
  process.exit(0);
}
