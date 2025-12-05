# API_EXAMPLES.md - Exemplos de Uso da API

## 🔑 Autenticação

Todas as requisições devem incluir sua API Key no header `Authorization`:

```
Authorization: Bearer sua-api-key-aqui
```

## 📍 Endpoints Disponíveis

### 1. Consultar CNPJ

**Endpoint:** `GET /api/v1/cnpj/{cnpj}`

**Descrição:** Consulta dados de um CNPJ. Retorna do cache se disponível (< 15 dias), senão busca nas APIs externas.

**Exemplo:**

```bash
curl -X GET "http://localhost:3000/api/v1/cnpj/00000000000191" \
  -H "Authorization: Bearer cnpj_sua-api-key-aqui"
```

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "cnpj": "00000000000191",
    "razaoSocial": "BANCO DO BRASIL S.A.",
    "nomeFantasia": "BANCO DO BRASIL",
    "cnae": "6422100",
    "descricaoCnae": "Bancos múltiplos, com carteira comercial",
    "naturezaJuridica": "Sociedade de Economia Mista",
    "dataAbertura": "1808-01-01",
    "situacaoCadastral": "Ativa",
    "dataSituacaoCadastral": "2000-01-01",
    "capitalSocial": "100000000000",
    "porte": "Demais",
    "endereco": {
      "logradouro": "SBS Quadra 1 Bloco A",
      "numero": "Lote 32",
      "complemento": "Edifício Sede I",
      "bairro": "Asa Sul",
      "municipio": "Brasília",
      "uf": "DF",
      "cep": "70073901"
    },
    "contato": {
      "telefone": "08007297777",
      "email": null
    },
    "socios": [
      {
        "nome": "UNIÃO FEDERAL",
        "qualificacao": "Acionista Pessoa Jurídica de Direito Público",
        "dataEntrada": "2000-01-01",
        "cpfCnpj": null
      }
    ],
    "fonte": "BrasilAPI",
    "dataAtualizacao": "2025-12-05T10:30:00.000Z"
  },
  "meta": {
    "timestamp": "2025-12-05T10:30:00.000Z",
    "creditCost": 0.33,
    "creditsRemaining": 99.67
  }
}
```

**Erros Possíveis:**

```json
// 400 - CNPJ inválido
{
  "success": false,
  "error": {
    "message": "CNPJ inválido",
    "code": "ValidationError"
  }
}

// 401 - Não autenticado
{
  "success": false,
  "error": {
    "message": "API key não fornecida",
    "code": "UnauthorizedError"
  }
}

// 402 - Créditos insuficientes
{
  "success": false,
  "error": {
    "message": "Créditos insuficientes. Necessário: 0.33",
    "code": "INSUFFICIENT_CREDITS"
  },
  "meta": {
    "creditCost": 0.33,
    "creditsRemaining": 0.12
  }
}

// 429 - Rate limit excedido
{
  "success": false,
  "error": {
    "message": "Limite de 2 requisições por segundo excedido. Tente novamente em 1s.",
    "code": "RateLimitError"
  }
}
```

### 2. Buscar Estatísticas

**Endpoint:** `GET /api/v1/stats`

**Descrição:** Retorna estatísticas de uso da sua conta.

**Exemplo:**

```bash
curl -X GET "http://localhost:3000/api/v1/stats" \
  -H "Authorization: Bearer cnpj_sua-api-key-aqui"
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "credits": 99.67,
    "totalQueries": 1,
    "recentQueries": [
      {
        "cnpj": "00000000000191",
        "source": "BrasilAPI",
        "creditCost": 0.33,
        "createdAt": "2025-12-05T10:30:00.000Z",
        "success": true
      }
    ]
  }
}
```

## 💻 Exemplos em Diferentes Linguagens

### JavaScript / Node.js

```javascript
const API_KEY = 'cnpj_sua-api-key-aqui';
const BASE_URL = 'http://localhost:3000/api/v1';

async function consultarCNPJ(cnpj) {
  try {
    const response = await fetch(`${BASE_URL}/cnpj/${cnpj}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('Razão Social:', data.data.razaoSocial);
      console.log('Créditos restantes:', data.meta.creditsRemaining);
      return data.data;
    } else {
      console.error('Erro:', data.error.message);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
}

// Uso
consultarCNPJ('00000000000191');
```

### Python

```python
import requests

API_KEY = 'cnpj_sua-api-key-aqui'
BASE_URL = 'http://localhost:3000/api/v1'

def consultar_cnpj(cnpj):
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    
    response = requests.get(
        f'{BASE_URL}/cnpj/{cnpj}',
        headers=headers
    )
    
    data = response.json()
    
    if data['success']:
        print(f"Razão Social: {data['data']['razaoSocial']}")
        print(f"Créditos restantes: {data['meta']['creditsRemaining']}")
        return data['data']
    else:
        print(f"Erro: {data['error']['message']}")
        return None

# Uso
consultar_cnpj('00000000000191')
```

### PHP

```php
<?php

$apiKey = 'cnpj_sua-api-key-aqui';
$baseUrl = 'http://localhost:3000/api/v1';

function consultarCNPJ($cnpj) {
    global $apiKey, $baseUrl;
    
    $ch = curl_init("$baseUrl/cnpj/$cnpj");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey"
    ]);
    
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    curl_close($ch);
    
    if ($data['success']) {
        echo "Razão Social: " . $data['data']['razaoSocial'] . "\n";
        echo "Créditos restantes: " . $data['meta']['creditsRemaining'] . "\n";
        return $data['data'];
    } else {
        echo "Erro: " . $data['error']['message'] . "\n";
        return null;
    }
}

// Uso
consultarCNPJ('00000000000191');
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

const (
    APIKey  = "cnpj_sua-api-key-aqui"
    BaseURL = "http://localhost:3000/api/v1"
)

type Response struct {
    Success bool `json:"success"`
    Data    struct {
        RazaoSocial string `json:"razaoSocial"`
    } `json:"data"`
    Meta struct {
        CreditsRemaining float64 `json:"creditsRemaining"`
    } `json:"meta"`
    Error struct {
        Message string `json:"message"`
    } `json:"error"`
}

func consultarCNPJ(cnpj string) error {
    req, _ := http.NewRequest("GET", fmt.Sprintf("%s/cnpj/%s", BaseURL, cnpj), nil)
    req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", APIKey))

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var data Response
    json.Unmarshal(body, &data)

    if data.Success {
        fmt.Printf("Razão Social: %s\n", data.Data.RazaoSocial)
        fmt.Printf("Créditos restantes: %.2f\n", data.Meta.CreditsRemaining)
    } else {
        fmt.Printf("Erro: %s\n", data.Error.Message)
    }

    return nil
}

func main() {
    consultarCNPJ("00000000000191")
}
```

## 🔄 Consulta em Lote (Loop)

**⚠️ IMPORTANTE:** Respeite o rate limit do seu plano!

```javascript
async function consultarLote(cnpjs) {
  const results = [];
  
  for (const cnpj of cnpjs) {
    try {
      const result = await consultarCNPJ(cnpj);
      results.push(result);
      
      // Aguarda 1 segundo entre requisições (plano básico: 2 req/s)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Erro ao consultar ${cnpj}:`, error);
    }
  }
  
  return results;
}

// Uso
const cnpjs = ['00000000000191', '11222333000181', '12345678000195'];
consultarLote(cnpjs);
```

## 📊 Monitoramento de Créditos

```javascript
async function verificarCreditos() {
  const response = await fetch('http://localhost:3000/api/v1/stats', {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log(`Créditos: ${data.data.credits}`);
    console.log(`Total de consultas: ${data.data.totalQueries}`);
    
    // Alerta se créditos baixos
    if (data.data.credits < 10) {
      console.warn('⚠️ Créditos baixos! Considere adicionar mais.');
    }
  }
}
```

## 🎯 Boas Práticas

1. **Armazene a API Key de forma segura** (variáveis de ambiente)
2. **Implemente retry logic** para lidar com erros temporários
3. **Respeite o rate limit** do seu plano
4. **Monitore seus créditos** regularmente
5. **Use cache local** quando possível para dados já consultados
6. **Trate erros adequadamente** (401, 402, 429, 500)

## 📝 Notas

- CNPJs podem ser passados com ou sem formatação
- Dados em cache são retornados instantaneamente
- Cache é atualizado automaticamente após 15 dias
- Cada consulta consome créditos, mesmo se vier do cache
