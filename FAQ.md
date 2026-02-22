# ❓ FAQ - Perguntas Frequentes

## 🚀 Geral

### O que é CNPJota?

CNPJota é uma API SaaS para consulta de dados de CNPJ (empresas brasileiras). Oferecemos:

- Cache inteligente (15 dias)
- Múltiplas fontes de dados com fallback automático
- Sistema de créditos flexível
- Alta disponibilidade

### É gratuito?

Novos usuários ganham **100 créditos de boas-vindas** (~300 consultas). Depois, você pode adicionar créditos conforme necessário.

### Preciso de conhecimento técnico?

Para usar a API, sim - você precisa saber fazer requisições HTTP. Mas fornecemos exemplos em várias linguagens!

## 💰 Créditos

### Quanto custa por consulta?

Cada consulta custa **0.33 créditos**, independentemente da fonte de dados utilizada.

### Como funcionam os créditos?

- Cada consulta deduz créditos da sua conta
- Mesmo dados em cache consomem créditos (mas são mais rápidos)
- Créditos nunca expiram
- Você vê o saldo em tempo real

### Como adicionar créditos?

Atualmente via dashboard (sistema de pagamento em desenvolvimento).

### Posso compartilhar créditos entre contas?

Não. Cada conta tem seu próprio saldo de créditos.

## 🔑 API Keys

### Como criar uma API Key?

1. Faça login no dashboard
2. Vá na aba "API Keys"
3. Clique em "Criar"
4. Copie a key (você não verá novamente!)

### Posso ter múltiplas API Keys?

Sim! Recomendamos uma key por ambiente (desenvolvimento, produção, etc.).

### Perdi minha API Key, e agora?

Por segurança, não podemos recuperar. Você precisa:

1. Desativar a key perdida
2. Criar uma nova
3. Atualizar suas aplicações

### Como proteger minha API Key?

```bash
# ❌ NUNCA faça isso
const apiKey = "cnpj_abc123..."

# ✅ SEMPRE use variáveis de ambiente
const apiKey = process.env.CNPJ_API_KEY
```

## 📊 Consultas

### Quais dados são retornados?

- Razão Social
- Nome Fantasia
- CNAE e descrição
- Natureza Jurídica
- Endereço completo
- Telefone e email
- Sócios (quando disponível)
- Situação cadastral
- E muito mais!

### Os dados vêm da Receita Federal?

Sim, indiretamente. Usamos 4 APIs públicas que consomem dados da Receita Federal:

1. BrasilAPI
2. OpenCNPJ
3. CNPJá
4. ReceitaWS

### E se todas as APIs falharem?

Retornamos um erro explicando que todas as fontes falharam. Tente novamente mais tarde.

### Quanto tempo demora uma consulta?

- **Do cache**: < 100ms
- **APIs externas**: 1-5 segundos (depende da API)

### Posso consultar CNPJs inativos?

Sim! Retornamos o status cadastral da empresa.

## 🔄 Cache

### Como funciona o cache?

1. Primeira consulta: buscamos em APIs externas e salvamos
2. Próximas consultas: retornamos do cache (se < 15 dias)
3. Após 15 dias: atualizamos automaticamente

### Posso forçar atualização?

Atualmente não. O cache é atualizado automaticamente após 15 dias.

### Por que ainda cobram do cache?

Porque você está usando nossa infraestrutura, banco de dados e API. O cache é um benefício adicional para velocidade.

## ⚡ Rate Limiting

### Quantas requisições posso fazer?

A API tem um limite de requisições por segundo para garantir a estabilidade do serviço para todos os usuários.

### O que acontece se exceder?

Retornamos erro `429 Too Many Requests`. Aguarde 1 segundo e tente novamente.

### Como fazer consultas em lote?

```javascript
async function consultarLote(cnpjs) {
  for (const cnpj of cnpjs) {
    await consultarCNPJ(cnpj);
    // Aguarde entre requisições
    await sleep(500); // 500ms = 2 req/s
  }
}
```

## 🔧 Técnico

### Quais linguagens posso usar?

Qualquer uma! É uma API REST padrão. Temos exemplos em:

- JavaScript/Node.js
- Python
- PHP
- Go
- cURL

### Preciso de um servidor?

Não necessariamente. Você pode:

- Chamar do frontend (exponha a key com cuidado!)
- Usar serverless functions (Vercel, Netlify)
- Usar em qualquer backend

### Suporta CORS?

Sim, mas recomendamos **não chamar do frontend** por segurança da API key.

### Tem webhook?

Ainda não, mas está nos planos!

### Tem SDK oficial?

Ainda não, mas é simples usar fetch/axios/requests.

## 🐛 Problemas Comuns

### Erro 401 - Unauthorized

- Verifique se incluiu o header `Authorization: Bearer sua-key`
- Confira se a key está ativa
- Teste com uma key nova

### Erro 402 - Insufficient Credits

- Você ficou sem créditos
- Adicione mais créditos no dashboard

### Erro 429 - Rate Limit

- Você fez muitas requisições muito rápido
- Aguarde 1 segundo entre requisições
- Considere upgrade de plano

### Erro 500 - Internal Server Error

- Pode ser temporário
- Tente novamente em alguns segundos
- Se persistir, reporte no GitHub

### CNPJ não encontrado

Verifique se:

- CNPJ está correto
- CNPJ existe (valide em: receita.fazenda.gov.br)
- Tentamos todas as 4 APIs (veja logs)

## 🔐 Segurança

### Meus dados estão seguros?

Sim! Usamos:

- HTTPS obrigatório
- API Keys com hash SHA-256
- OAuth 2.0 para login
- Banco de dados criptografado

### Vocês armazenam senhas?

Não! Usamos OAuth (Google/GitHub). Nunca vemos sua senha.

### Posso deletar minha conta?

Em desenvolvimento. Por enquanto, entre em contato.

## 🌍 Limites e Restrições

### Tem limite de consultas por dia?

Não, apenas por segundo (rate limit). Desde que tenha créditos, pode consultar o quanto quiser.

### Posso usar comercialmente?

Sim! CNPJota é ideal para:

- Validação de cadastros
- Sistemas de crédito
- Análise de dados
- Compliance

### Tem SLA?

Atualmente não. Mas usamos 4 APIs com fallback para máxima disponibilidade.

## 📞 Suporte

### Como obter ajuda?

1. Confira a documentação (README.md, API_EXAMPLES.md)
2. Veja exemplos de código
3. Abra uma issue no GitHub
4. Email: suporte@seu-dominio.com

### Tempo de resposta?

- Issues GitHub: 24-48h
- Email: 48-72h
- Bugs críticos: prioridade máxima

### Oferecem suporte dedicado?

Planejado para planos Enterprise (em breve).

## 🚀 Futuro

### Quais features estão vindo?

- Sistema de pagamento
- Webhooks
- Dashboard com gráficos
- Consulta em lote
- Exportação de relatórios
- SDK oficial
- API GraphQL

### Posso sugerir features?

Sim! Abra uma issue com tag `enhancement`.

### Como contribuir?

Veja [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Não encontrou sua pergunta?**

- 📧 Email: suporte@seu-dominio.com
- 💬 GitHub: [Abrir Issue](https://github.com/seu-usuario/cnpjota/issues)
- 📖 Docs: [README.md](README.md)
