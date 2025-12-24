'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Key, BarChart3, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';
import { LanguageIcon } from '@/components/ui/language-icon';

interface DashboardClientProps {
  user: {
    name: string | null;
    email: string;
    plan: {
      displayName: string;
      creditCost: number;
      maxRequestsPerSecond: number;
    } | null;
  };
  stats: {
    credits: number;
    totalQueries: number;
  };
  apiKey: {
    id: string;
    name: string;
    key: string;
    lastUsedAt: Date | null;
    createdAt: Date;
  } | null;
  apiUrl: string;
}

export default function DashboardClient({ user, stats, apiKey: initialApiKey, apiUrl }: DashboardClientProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateApiKey = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'API Key' }),
      });

      const result = await response.json();

      if (result.success) {
        setCreatedApiKey(result.data.key);
        setApiKey({
          id: result.data.id,
          name: result.data.name,
          key: result.data.key,
          lastUsedAt: null,
          createdAt: new Date(result.data.createdAt),
        });
      }
    } catch (error) {
      console.error('Erro ao criar API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Tem certeza que deseja regenerar sua API key? A chave atual será desativada.')) return;

    setIsCreating(true);
    try {
      const response = await fetch(`/api/v1/api-keys/${apiKey!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate: true }),
      });

      const result = await response.json();

      if (result.success) {
        setCreatedApiKey(result.data.key);
        setApiKey({
          id: result.data.id,
          name: result.data.name,
          key: result.data.key,
          lastUsedAt: null,
          createdAt: new Date(result.data.createdAt),
        });
      }
    } catch (error) {
      console.error('Erro ao regenerar API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Disponíveis</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.credits.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ~{Math.floor(stats.credits / (user.plan?.creditCost || 0.33))} consultas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">Consultas realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.plan?.displayName || 'Básico'}</div>
            <p className="text-xs text-muted-foreground">
              {user.plan?.creditCost || 0.33} créditos/consulta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com informações */}
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
          <TabsTrigger value="credits">Adicionar Créditos</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sua API Key</CardTitle>
              <CardDescription>
                Chave de API para acessar o serviço CNPJota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {createdApiKey && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ✓ API Key criada com sucesso!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                    Copie agora, você não poderá ver novamente:
                  </p>
                  <div className="flex gap-2">
                    <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded border text-xs break-all">
                      {createdApiKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(createdApiKey)}
                    >
                      {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setCreatedApiKey(null)}
                  >
                    Fechar
                  </Button>
                </div>
              )}

              {!apiKey ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Você ainda não possui uma API key. Crie uma para começar a usar o serviço.
                  </p>
                  <Button onClick={handleCreateApiKey} disabled={isCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar API Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="font-medium">API Key</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateApiKey}
                        disabled={isCreating}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Regenerar
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">API KEY</label>
                        <div className="flex gap-2 mt-1">
                          <code className="flex-1 p-2 bg-background rounded border text-xs break-all font-mono">
                            {apiKey.key}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Criada em {new Date(apiKey.createdAt).toLocaleDateString('pt-BR')}</span>
                        {apiKey.lastUsedAt && (
                          <span>Último uso: {new Date(apiKey.lastUsedAt).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p><strong>Importante:</strong> Mantenha sua API key segura e não a compartilhe publicamente.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Como Integrar</CardTitle>
              <CardDescription>
                Exemplos de código em diversas linguagens de programação populares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">URL da API:</span>
                  <code className="text-sm bg-background px-2 py-1 rounded border font-mono">
                    {apiUrl}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use esta URL nos seus exemplos de integração. Em produção, configure a variável NEXT_PUBLIC_API_URL com o domínio do seu servidor.
                </p>
              </div>

              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 h-auto gap-2 bg-muted/50 p-2">
                  <TabsTrigger value="javascript" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="javascript" className="w-5 h-5" />
                    <span className="hidden sm:inline">JavaScript</span>
                  </TabsTrigger>
                  <TabsTrigger value="python" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="python" className="w-5 h-5" />
                    <span className="hidden sm:inline">Python</span>
                  </TabsTrigger>
                  <TabsTrigger value="php" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="php" className="w-5 h-5" />
                    <span className="hidden sm:inline">PHP</span>
                  </TabsTrigger>
                  <TabsTrigger value="java" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="java" className="w-5 h-5" />
                    <span className="hidden sm:inline">Java</span>
                  </TabsTrigger>
                  <TabsTrigger value="go" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="go" className="w-5 h-5" />
                    <span className="hidden sm:inline">Go</span>
                  </TabsTrigger>
                  <TabsTrigger value="ruby" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="ruby" className="w-5 h-5" />
                    <span className="hidden sm:inline">Ruby</span>
                  </TabsTrigger>
                  <TabsTrigger value="csharp" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="csharp" className="w-5 h-5" />
                    <span className="hidden sm:inline">C#</span>
                  </TabsTrigger>
                  <TabsTrigger value="curl" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <LanguageIcon language="curl" className="w-5 h-5" />
                    <span className="hidden sm:inline">cURL</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="javascript" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F7DF1E]/20 bg-[#F7DF1E]/10 text-sm font-medium">
                    <LanguageIcon language="javascript" className="w-5 h-5" />
                    JavaScript / Node.js
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando fetch API (Node.js 18+ ou navegador):
                  </p>
                  <CodeBlock 
                    language="javascript" 
                    code={`const apiKey = '${apiKey?.key || 'sua-api-key-aqui'}';
const cnpj = '00000000000191';

const response = await fetch(
  \`${apiUrl}/api/v1/cnpj/\${cnpj}\`,
  {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    }
  }
);

const data = await response.json();
console.log(data);`} 
                  />
                </TabsContent>

                <TabsContent value="python" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3776AB]/20 bg-[#3776AB]/10 text-sm font-medium">
                    <LanguageIcon language="python" className="w-5 h-5" />
                    Python 3
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando a biblioteca requests:
                  </p>
                  <CodeBlock 
                    language="python" 
                    code={`import requests

api_key = '${apiKey?.key || 'sua-api-key-aqui'}'
cnpj = '00000000000191'

response = requests.get(
    f'${apiUrl}/api/v1/cnpj/{cnpj}',
    headers={'Authorization': f'Bearer {api_key}'}
)

data = response.json()
print(data)`} 
                  />
                </TabsContent>

                <TabsContent value="php" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#777BB4]/20 bg-[#777BB4]/10 text-sm font-medium">
                    <LanguageIcon language="php" className="w-5 h-5" />
                    PHP
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando cURL do PHP:
                  </p>
                  <CodeBlock 
                    language="php" 
                    code={`<?php
$apiKey = '${apiKey?.key || 'sua-api-key-aqui'}';
$cnpj = '00000000000191';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${apiUrl}/api/v1/cnpj/$cnpj");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey"
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);`} 
                  />
                </TabsContent>

                <TabsContent value="java" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#007396]/20 bg-[#007396]/10 text-sm font-medium">
                    <LanguageIcon language="java" className="w-5 h-5" />
                    Java 11+
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando HttpClient:
                  </p>
                  <CodeBlock 
                    language="java" 
                    code={`import java.net.http.*;
import java.net.URI;

String apiKey = "${apiKey?.key || 'sua-api-key-aqui'}";
String cnpj = "00000000000191";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${apiUrl}/api/v1/cnpj/" + cnpj))
    .header("Authorization", "Bearer " + apiKey)
    .GET()
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
    
System.out.println(response.body());`} 
                  />
                </TabsContent>

                <TabsContent value="go" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ADD8]/20 bg-[#00ADD8]/10 text-sm font-medium">
                    <LanguageIcon language="go" className="w-5 h-5" />
                    Go (Golang)
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando net/http:
                  </p>
                  <CodeBlock 
                    language="go" 
                    code={`package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    apiKey := "${apiKey?.key || 'sua-api-key-aqui'}"
    cnpj := "00000000000191"
    
    url := fmt.Sprintf("${apiUrl}/api/v1/cnpj/%s", cnpj)
    
    req, _ := http.NewRequest("GET", url, nil)
    req.Header.Add("Authorization", "Bearer "+apiKey)
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`} 
                  />
                </TabsContent>

                <TabsContent value="ruby" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#CC342D]/20 bg-[#CC342D]/10 text-sm font-medium">
                    <LanguageIcon language="ruby" className="w-5 h-5" />
                    Ruby
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando Net::HTTP:
                  </p>
                  <CodeBlock 
                    language="ruby" 
                    code={`require 'net/http'
require 'json'

api_key = '${apiKey?.key || 'sua-api-key-aqui'}'
cnpj = '00000000000191'

uri = URI("${apiUrl}/api/v1/cnpj/#{cnpj}")
req = Net::HTTP::Get.new(uri)
req['Authorization'] = "Bearer #{api_key}"

res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(req)
end

data = JSON.parse(res.body)
puts data`} 
                  />
                </TabsContent>

                <TabsContent value="csharp" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#239120]/20 bg-[#239120]/10 text-sm font-medium">
                    <LanguageIcon language="csharp" className="w-5 h-5" />
                    C# / .NET
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando HttpClient:
                  </p>
                  <CodeBlock 
                    language="csharp" 
                    code={`using System;
using System.Net.Http;
using System.Threading.Tasks;

var apiKey = "${apiKey?.key || 'sua-api-key-aqui'}";
var cnpj = "00000000000191";

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

var response = await client.GetAsync(
    $"{apiUrl}/api/v1/cnpj/{cnpj}"
);

var data = await response.Content.ReadAsStringAsync();
Console.WriteLine(data);`} 
                  />
                </TabsContent>

                <TabsContent value="curl" className="space-y-4 mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#073551]/20 bg-[#073551]/10 text-sm font-medium">
                    <LanguageIcon language="curl" className="w-5 h-5" />
                    cURL (Terminal)
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Exemplo usando cURL no terminal:
                  </p>
                  <CodeBlock 
                    language="bash" 
                    code={`curl -X GET "${apiUrl}/api/v1/cnpj/00000000000191" \\
  -H "Authorization: Bearer ${apiKey?.key || 'sua-api-key-aqui'}"`} 
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-xl">
                <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  Estrutura de Resposta da API
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A API retorna os dados da empresa em formato JSON estruturado:
                </p>
                <CodeBlock 
                  language="json" 
                  code={`{
  "success": true,
  "data": {
    "cnpj": "00000000000191",
    "razaoSocial": "EMPRESA EXEMPLO LTDA",
    "nomeFantasia": "EXEMPLO",
    "situacaoCadastral": "ATIVA",
    "dataAbertura": "2020-01-01",
    "capitalSocial": "100000.00",
    "porte": "MICRO EMPRESA",
    "endereco": {
      "logradouro": "RUA EXEMPLO",
      "numero": "123",
      "bairro": "CENTRO",
      "municipio": "SÃO PAULO",
      "uf": "SP",
      "cep": "01234-567"
    }
  }
}`} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Créditos</CardTitle>
              <CardDescription>
                Escolha um pacote de créditos para continuar usando o serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition">
                  <h4 className="font-bold text-lg">Básico</h4>
                  <p className="text-3xl font-bold my-2">R$ 9,90</p>
                  <p className="text-sm text-muted-foreground mb-4">100 créditos</p>
                  <p className="text-xs text-muted-foreground">~300 consultas</p>
                  <Button className="w-full mt-4" variant="outline">
                    Em breve
                  </Button>
                </div>

                <div className="border-2 border-primary rounded-lg p-4 hover:border-primary cursor-pointer transition relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                  <h4 className="font-bold text-lg">Profissional</h4>
                  <p className="text-3xl font-bold my-2">R$ 29,90</p>
                  <p className="text-sm text-muted-foreground mb-4">500 créditos</p>
                  <p className="text-xs text-muted-foreground">~1.500 consultas</p>
                  <Button className="w-full mt-4">Em breve</Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition">
                  <h4 className="font-bold text-lg">Empresarial</h4>
                  <p className="text-3xl font-bold my-2">R$ 99,90</p>
                  <p className="text-sm text-muted-foreground mb-4">2.000 créditos</p>
                  <p className="text-xs text-muted-foreground">~6.000 consultas</p>
                  <Button className="w-full mt-4" variant="outline">
                    Em breve
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Os valores são aproximados baseado no plano básico (0.33 créditos/consulta)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
