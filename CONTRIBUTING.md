# Contribuindo para CNPJota

Obrigado por considerar contribuir com o CNPJota! 🎉

## Como Contribuir

### Reportar Bugs

Se encontrar um bug, por favor abra uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Versão do Node.js e navegador

### Sugerir Melhorias

Sugestões são bem-vindas! Abra uma issue com:

- Descrição clara da funcionalidade
- Justificativa (por que seria útil?)
- Exemplos de uso

### Pull Requests

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript
- Siga as convenções do ESLint configurado
- Escreva código limpo e bem documentado
- Adicione comentários quando necessário
- Mantenha a arquitetura modular (Controllers, Services, Repositories)

### Estrutura de Commits

Use mensagens de commit claras:

```
feat: adiciona autenticação com Facebook
fix: corrige erro no cálculo de créditos
docs: atualiza README com novos exemplos
refactor: melhora performance do cache
test: adiciona testes para CnpjService
```

## Desenvolvimento

### Setup do Ambiente

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Setup do banco
npx prisma db push
npx prisma db seed

# Executar
npm run dev
```

### Estrutura do Projeto

```
src/
├── app/           # Next.js App Router (páginas e rotas)
├── components/    # Componentes React
├── controllers/   # Controllers da API
├── services/      # Lógica de negócio
├── repositories/  # Acesso a dados
├── lib/          # Utilitários
└── types/        # TypeScript types e DTOs
```

### Boas Práticas

1. **Controllers**: Apenas validação e orquestração
2. **Services**: Lógica de negócio
3. **Repositories**: Acesso ao banco de dados
4. **DTOs**: Para padronizar entrada/saída

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite feedback construtivo
- Foque no que é melhor para a comunidade

## Dúvidas?

Abra uma issue com a tag `question` ou entre em contato.

Obrigado! 🚀
