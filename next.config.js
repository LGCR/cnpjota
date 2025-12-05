/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Otimizações de build
  swcMinify: true,
  compress: true,
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Redirecionar para HTTPS em produção
  async redirects() {
    return [
      // Redireciona www para domínio principal (se aplicável)
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.seu-dominio.com' }],
      //   destination: 'https://seu-dominio.com/:path*',
      //   permanent: true,
      // }
    ]
  }
}

module.exports = nextConfig
