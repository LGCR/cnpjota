import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CNPJota - API de Consulta de CNPJ',
  description: 'Consulte CNPJs de forma simples e rápida com nossa API. Sistema de créditos, cache inteligente e múltiplas fontes de dados.',
  keywords: ['CNPJ', 'API', 'Consulta CNPJ', 'Brasil', 'Empresas', 'Receita Federal'],
  authors: [{ name: 'CNPJota' }],
  openGraph: {
    title: 'CNPJota - API de Consulta de CNPJ',
    description: 'Consulte CNPJs com nossa API simples e confiável',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
};
