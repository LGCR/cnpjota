'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Key, BarChart3, Copy, Check, Plus, Trash2 } from 'lucide-react';

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
  apiKeys: Array<{
    id: string;
    name: string;
    lastUsedAt: Date | null;
    createdAt: Date;
  }>;
}

export default function DashboardClient({ user, stats, apiKeys: initialApiKeys }: DashboardClientProps) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newApiKeyName }),
      });

      const result = await response.json();

      if (result.success) {
        setCreatedApiKey(result.data.key);
        setApiKeys([
          {
            id: result.data.id,
            name: result.data.name,
            lastUsedAt: null,
            createdAt: new Date(result.data.createdAt),
          },
          ...apiKeys,
        ]);
        setNewApiKeyName('');
      }
    } catch (error) {
      console.error('Erro ao criar API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta API key?')) return;

    try {
      const response = await fetch(`/api/v1/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar API key:', error);
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
              <CardTitle>Suas API Keys</CardTitle>
              <CardDescription>
                Gerencie as chaves de API para acessar o serviço
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

              <div className="flex gap-2">
                <Input
                  placeholder="Nome da API Key (ex: Produção)"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateApiKey()}
                />
                <Button onClick={handleCreateApiKey} disabled={isCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
              </div>

              <div className="space-y-2">
                {apiKeys.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma API key criada ainda
                  </p>
                ) : (
                  apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Criada em {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                          {key.lastUsedAt &&
                            ` • Último uso: ${new Date(key.lastUsedAt).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Como Integrar</CardTitle>
              <CardDescription>
                Exemplos de código para integrar com a API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">JavaScript / Node.js</h4>
                <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
{`const apiKey = 'sua-api-key-aqui';
const cnpj = '00000000000191';

const response = await fetch(
  \`https://seu-dominio.com/api/v1/cnpj/\${cnpj}\`,
  {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    }
  }
);

const data = await response.json();
console.log(data);`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Python</h4>
                <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
{`import requests

api_key = 'sua-api-key-aqui'
cnpj = '00000000000191'

response = requests.get(
    f'https://seu-dominio.com/api/v1/cnpj/{cnpj}',
    headers={'Authorization': f'Bearer {api_key}'}
)

data = response.json()
print(data)`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">cURL</h4>
                <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
{`curl -X GET "https://seu-dominio.com/api/v1/cnpj/00000000000191" \\
  -H "Authorization: Bearer sua-api-key-aqui"`}
                </pre>
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
