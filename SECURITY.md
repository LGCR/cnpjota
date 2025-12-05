# Política de Segurança

## 🔒 Versões Suportadas

Atualmente damos suporte à seguinte versão:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |

## 🐛 Reportar Vulnerabilidades

Se você descobriu uma vulnerabilidade de segurança no CNPJota, por favor **NÃO** abra uma issue pública.

### Como Reportar

1. **Email**: Envie um email para: `security@seu-dominio.com`
2. **Assunto**: `[SECURITY] Descrição breve da vulnerabilidade`
3. **Conteúdo**:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se tiver)

### O Que Esperar

- **Confirmação**: Responderemos em até 48 horas
- **Análise**: Investigaremos e validaremos a vulnerabilidade
- **Correção**: Trabalharemos em uma correção prioritária
- **Divulgação**: Após a correção, divulgaremos responsavelmente
- **Créditos**: Você será creditado (se desejar) no changelog

## 🛡️ Medidas de Segurança Implementadas

### Autenticação e Autorização
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ Sessions com NextAuth
- ✅ API Keys com hash SHA-256
- ✅ Proteção de rotas sensíveis

### Proteção de Dados
- ✅ Variáveis de ambiente para secrets
- ✅ Banco de dados com senha forte
- ✅ Conexões SSL/TLS
- ✅ Nenhum dado sensível em logs

### API Security
- ✅ Rate limiting por usuário
- ✅ Validação de entrada (CNPJ, etc.)
- ✅ Sanitização de dados
- ✅ Timeout de 10s em APIs externas
- ✅ Headers de segurança HTTP

### Infrastructure
- ✅ HTTPS obrigatório em produção
- ✅ CORS configurado
- ✅ Firewall rules
- ✅ Database backups automáticos

## 🚨 Boas Práticas para Usuários

### Desenvolvedores

1. **API Keys**
   - ❌ Nunca commite API keys no código
   - ✅ Use variáveis de ambiente
   - ✅ Rotacione keys periodicamente
   - ✅ Delete keys não utilizadas

2. **Secrets**
   ```bash
   # ❌ Nunca
   const apiKey = "cnpj_abc123def456..."
   
   # ✅ Sempre
   const apiKey = process.env.CNPJ_API_KEY
   ```

3. **Tratamento de Erros**
   - Não exponha detalhes técnicos em produção
   - Log erros internamente, não no cliente

### Usuários Finais

1. **Senhas Fortes**
   - Não aplicável (usamos OAuth)
   - Mas proteja suas contas Google/GitHub!

2. **Monitoramento**
   - Revise regularmente suas API keys
   - Monitore uso de créditos
   - Reporte atividades suspeitas

## 🔍 Auditoria de Segurança

### Checklist de Deploy

- [ ] Todas secrets em variáveis de ambiente
- [ ] HTTPS habilitado
- [ ] NEXTAUTH_SECRET forte e único
- [ ] Database com senha forte
- [ ] Firewall configurado
- [ ] Rate limiting ativo
- [ ] Logs configurados
- [ ] Backups automáticos
- [ ] Headers de segurança ativos

### Ferramentas Recomendadas

- **npm audit** - Vulnerabilidades em dependências
- **Snyk** - Scan de vulnerabilidades
- **OWASP ZAP** - Scan de segurança web
- **Dependabot** - Atualizações automáticas

## 📝 Compliance

### LGPD (Lei Geral de Proteção de Dados)

**Dados Coletados:**
- Email (via OAuth)
- Nome (via OAuth)
- Imagem de perfil (via OAuth)

**Uso dos Dados:**
- Autenticação
- Identificação de uso da API
- Billing e créditos

**Direitos do Usuário:**
- Acesso aos seus dados
- Correção de dados
- Exclusão de conta (em desenvolvimento)

### Retenção de Dados

- **Consultas de CNPJ**: Mantidas indefinidamente (dados públicos)
- **Logs de acesso**: 90 dias
- **Sessões**: 30 dias de inatividade
- **API Keys**: Até serem revogadas

## 🔐 Criptografia

### Em Trânsito
- TLS 1.2+ para todas as conexões
- HTTPS obrigatório em produção

### Em Repouso
- API Keys: SHA-256 hash
- Passwords: Gerenciado pelo OAuth provider
- Database: Criptografia do provider (Supabase)

## 🚫 O Que NÃO Fazemos

- ❌ Armazenar senhas (usamos OAuth)
- ❌ Vender dados de usuários
- ❌ Compartilhar API keys
- ❌ Logar dados sensíveis
- ❌ Usar cookies de terceiros

## 📞 Contato

Para questões de segurança:
- Email: security@seu-dominio.com
- Tempo de resposta: 48 horas

Para questões gerais:
- GitHub Issues: https://github.com/seu-usuario/cnpjota/issues
- Email: suporte@seu-dominio.com

## 🏆 Hall da Fama de Segurança

Agradecemos aos seguintes pesquisadores de segurança que reportaram vulnerabilidades responsavelmente:

*(Nenhum até o momento)*

---

**Última atualização**: 2025-12-05
**Versão**: 1.0.0
