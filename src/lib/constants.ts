// Configurações da aplicação
export const APP_CONFIG = {
  name: 'CNPJota',
  description: 'API de consulta de CNPJ com créditos',
  version: '1.0.0',
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  cnpjCacheDays: parseInt(process.env.CNPJ_CACHE_DAYS || '15'),
  defaultTTL: 15 * 24 * 60 * 60 * 1000, // 15 dias em ms
} as const;

// Configurações de rate limiting
export const RATE_LIMIT_CONFIG = {
  defaultMaxRequests: parseInt(process.env.API_RATE_LIMIT_PER_SECOND || '2'),
  windowMs: 1000, // 1 segundo
} as const;

// Configurações de API externa
export const EXTERNAL_API_CONFIG = {
  timeout: 10000, // 10 segundos
  retryAttempts: 0, // Não retry (já temos fallback)
} as const;

// Códigos de erro
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  INVALID_CNPJ: 'CNPJ inválido',
  CNPJ_NOT_PROVIDED: 'CNPJ não fornecido',
  API_KEY_NOT_PROVIDED: 'API key não fornecida',
  INVALID_API_KEY: 'API key inválida',
  INSUFFICIENT_CREDITS: 'Créditos insuficientes',
  RATE_LIMIT_EXCEEDED: 'Limite de requisições excedido',
  INTERNAL_ERROR: 'Erro interno do servidor',
} as const;

// Planos padrão
export const PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Plano Básico',
    creditCost: 0.33,
    maxRequestsPerSecond: 2,
  },
  PRO: {
    id: 'pro',
    name: 'Plano Profissional',
    creditCost: 0.25,
    maxRequestsPerSecond: 5,
  },
  BUSINESS: {
    id: 'business',
    name: 'Plano Empresarial',
    creditCost: 0.20,
    maxRequestsPerSecond: 10,
  },
} as const;

// Bônus de boas-vindas
export const WELCOME_BONUS = 100; // créditos
