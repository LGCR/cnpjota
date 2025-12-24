'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CreditCard,
  Key,
  BarChart3,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Settings,
  Sparkles,
  TrendingUp,
  Activity,
  Code2,
  Eye,
  EyeOff,
  Crown,
  Zap,
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';
import { LanguageIcon } from '@/components/ui/language-icon';

interface DashboardModernProps {
  user: {
    name: string | null;
    email: string;
    image?: string | null;
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

export default function DashboardModern({ user, stats, apiKey: initialApiKey, apiUrl }: DashboardModernProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const maxQueries = Math.floor(stats.credits / (user.plan?.creditCost || 0.33));
  const creditProgress = (stats.credits / 1000) * 100;

  const displayKey = apiKey?.key || 'cnpj_xxxxxxxxxxxxxx';
  const maskedKey = showKey ? displayKey : `${displayKey.slice(0, 10)}${'•'.repeat(20)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header com gradiente */}
      <div className="gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20 shadow-xl">
                <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Olá, {user.name || 'Desenvolvedor'}!
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                </h1>
                <p className="text-purple-100">{user.email}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade de Plano
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 -mt-6">
        {/* Cards de Estatísticas com glassmorphism */}
        <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
          <Card className="glass-card hover-lift border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Créditos</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stats.credits.toFixed(2)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={creditProgress} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">{creditProgress.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                ~{maxQueries} consultas disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Consultas</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{stats.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                Total de consultas realizadas
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Plano</CardTitle>
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold flex items-center gap-2">
                {user.plan?.displayName || 'Básico'}
                <Badge variant="secondary" className="ml-auto">
                  <Activity className="h-3 w-3 mr-1" />
                  {user.plan?.maxRequestsPerSecond || 2} req/s
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {user.plan?.creditCost || 0.33} créditos por consulta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in">
          <TabsList className="glass p-1 h-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="api-key" className="gap-2">
              <Key className="h-4 w-4" />
              API Key
            </TabsTrigger>
            <TabsTrigger value="integration" className="gap-2">
              <Code2 className="h-4 w-4" />
              Integração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {createdApiKey && (
              <Alert className="glass-card border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 animate-slide-up">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm">
                  <strong>API Key criada com sucesso!</strong> Copie e guarde em local seguro.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Card de API Key */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-purple-600" />
                    Sua API Key
                  </CardTitle>
                  <CardDescription>
                    Use esta chave para autenticar suas requisições
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiKey ? (
                    <>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="flex-1 text-sm font-mono break-all">{maskedKey}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowKey(!showKey)}
                          >
                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            {copiedKey ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Criada em {new Date(apiKey.createdAt).toLocaleDateString('pt-BR')}</span>
                          {apiKey.lastUsedAt && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Último uso: {new Date(apiKey.lastUsedAt).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleRegenerateApiKey}
                        disabled={isCreating}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isCreating ? 'animate-spin' : ''}`} />
                        Regenerar API Key
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Você ainda não possui uma API Key
                      </p>
                      <Button onClick={handleCreateApiKey} disabled={isCreating} className="gradient-purple">
                        {isCreating ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Key className="mr-2 h-4 w-4" />
                        )}
                        Criar API Key
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card de Início Rápido */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-600" />
                    Início Rápido
                  </CardTitle>
                  <CardDescription>
                    Comece a usar a API em minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-bold text-purple-600">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Copie sua API Key</p>
                        <p className="text-sm text-muted-foreground">Use o botão ao lado para copiar</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-bold text-purple-600">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Faça sua primeira requisição</p>
                        <p className="text-sm text-muted-foreground">Consulte um CNPJ para testar</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-bold text-purple-600">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Integre em seu projeto</p>
                        <p className="text-sm text-muted-foreground">Veja exemplos na aba Integração</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('integration')}>
                    Ver Exemplos de Código
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-key" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Gerenciar API Key</CardTitle>
                <CardDescription>
                  Controle de acesso e segurança da sua chave de API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Conteúdo da aba API Key */}
                <p className="text-muted-foreground">Em breve: gerenciamento avançado de chaves</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Exemplos de Integração</CardTitle>
                <CardDescription>
                  Copie e cole o código para começar rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Conteúdo da aba Integração */}
                <p className="text-muted-foreground">Em breve: exemplos de código em várias linguagens</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
