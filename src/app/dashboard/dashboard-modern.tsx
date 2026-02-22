"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageIcon } from "@/components/ui/language-icon";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Code2,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  LogOut,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface DashboardModernProps {
  user: {
    name: string | null;
    email: string;
    image?: string | null;
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

export default function DashboardModern({
  user,
  stats,
  apiKey: initialApiKey,
  apiUrl,
}: DashboardModernProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("api-key");

  const handleCreateApiKey = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "API Key" }),
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
      console.error("Erro ao criar API key:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (
      !confirm(
        "Tem certeza que deseja regenerar sua API key? A chave atual será desativada.",
      )
    )
      return;

    setIsCreating(true);
    try {
      const response = await fetch(`/api/v1/api-keys/${apiKey!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      console.error("Erro ao regenerar API key:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Custo fixo de 0.33 créditos por consulta
  const CREDIT_COST_PER_QUERY = 0.33;
  const maxQueries = Math.floor(stats.credits / CREDIT_COST_PER_QUERY);
  const creditsUsed = stats.totalQueries * CREDIT_COST_PER_QUERY;
  const totalCreditsEver = stats.credits + creditsUsed;
  const creditProgress =
    totalCreditsEver > 0
      ? Math.min((stats.credits / totalCreditsEver) * 100, 100)
      : 100;

  const displayKey = apiKey?.key || "cnpj_xxxxxxxxxxxxxx";
  const maskedKey = showKey
    ? displayKey
    : `${displayKey.slice(0, 10)}${"•".repeat(20)}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/cnpjota.png"
                alt="CNPJota"
                className="w-10 h-10 rounded-xl object-cover shadow-medium"
              />
              <span className="text-xl font-bold gradient-text">CNPJota</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 hover:bg-purple-50 rounded-xl px-3 py-2 transition-colors"
                >
                  <Avatar className="h-9 w-9 border-2 border-purple-100 shadow-soft">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || ""}
                    />
                    <AvatarFallback className="bg-gradient-purple text-white text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() ||
                        user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name || "Desenvolvedor"}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {user.email}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="px-3 py-3 border-b border-gray-100 mb-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-purple-100">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || ""}
                      />
                      <AvatarFallback className="bg-gradient-purple text-white text-sm font-bold">
                        {user.name?.[0]?.toUpperCase() ||
                          user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || "Desenvolvedor"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="badge-modern text-xs">
                      {stats.credits.toFixed(2)} créditos
                    </Badge>
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer rounded-lg py-2.5 px-3 font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            Olá, {user.name || "Desenvolvedor"}!
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
          </h1>
          <p className="text-lg text-gray-600">
            Bem-vindo ao seu dashboard. Gerencie suas consultas e acompanhe seu
            uso.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8 animate-slide-up">
          <Card className="card-modern border-0 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Créditos Disponíveis
              </CardTitle>
              <div className="icon-wrapper">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">
                {stats.credits.toFixed(2)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{creditsUsed.toFixed(2)} usados</span>
                <span>{stats.credits.toFixed(2)} restantes</span>
              </div>
              <Progress value={creditProgress} className="h-2 mb-3" />
              <p className="text-xs text-gray-500 mb-0">
                ~{maxQueries.toLocaleString()} consultas disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Consultas
              </CardTitle>
              <div className="icon-wrapper">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalQueries.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                {stats.totalQueries > 0
                  ? "Consultas realizadas com sucesso"
                  : "Nenhuma consulta realizada ainda"}
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 overflow-hidden hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Custo por Consulta
              </CardTitle>
              <div className="icon-wrapper">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {CREDIT_COST_PER_QUERY.toFixed(2)} créditos
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Valor fixo por consulta CNPJ
              </p>
              <a href="/dashboard/credits">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full hover-lift"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  Adicionar Créditos
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-gray-100 p-1 h-auto shadow-soft">
            <TabsTrigger
              value="api-key"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
            >
              <Key className="h-4 w-4" />
              API Key
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
            >
              <Code2 className="h-4 w-4" />
              Documentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-key" className="space-y-6">
            {createdApiKey && (
              <Alert className="border-purple-200 bg-purple-50 animate-slide-up">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-purple-900">
                  <strong>API Key criada com sucesso!</strong> Copie e guarde em
                  local seguro.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* API Key Card */}
              <Card className="card-modern border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="icon-wrapper-light">
                      <Key className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Sua API Key</CardTitle>
                      <CardDescription>
                        Use esta chave para autenticar
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiKey ? (
                    <>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <code className="flex-1 text-sm font-mono break-all text-gray-900">
                            {maskedKey}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowKey(!showKey)}
                            className="hover:bg-gray-200"
                          >
                            {showKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="hover:bg-gray-200"
                          >
                            {copiedKey ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Criada{" "}
                            {new Date(apiKey.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                          {apiKey.lastUsedAt && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Último uso:{" "}
                              {new Date(apiKey.lastUsedAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleRegenerateApiKey}
                        disabled={isCreating}
                        variant="outline"
                        className="w-full shadow-soft hover-lift"
                      >
                        <RefreshCw
                          className={`mr-2 h-4 w-4 ${
                            isCreating ? "animate-spin" : ""
                          }`}
                        />
                        Regenerar API Key
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="icon-wrapper-light mx-auto mb-4">
                        <Key className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        Você ainda não possui uma API Key
                      </p>
                      <Button
                        onClick={handleCreateApiKey}
                        disabled={isCreating}
                        className="gradient-purple text-white shadow-medium hover-lift"
                      >
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

              {/* Quick Start Card */}
              <Card className="card-modern border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="icon-wrapper-light">
                      <Code2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Início Rápido</CardTitle>
                      <CardDescription>
                        Comece em 3 passos simples
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-600">
                        1
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          Copie sua API Key
                        </p>
                        <p className="text-sm text-gray-600">
                          Use o botão de copiar ao lado
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-600">
                        2
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          Faça sua primeira requisição
                        </p>
                        <p className="text-sm text-gray-600">
                          Consulte um CNPJ para testar
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-600">
                        3
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          Integre em seu projeto
                        </p>
                        <p className="text-sm text-gray-600">
                          Veja exemplos na aba Integração
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 shadow-soft hover-lift"
                    onClick={() => setActiveTab("documentation")}
                  >
                    Ver Exemplos de Código
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Add Credits CTA */}
            <Card className="card-modern border-0 gradient-purple text-white overflow-hidden relative">
              <div className="bg-grid absolute inset-0 opacity-10" />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">
                      Precisa de mais créditos?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Compre pacotes de créditos e continue consultando CNPJs
                      com tarifas competitivas
                    </p>
                    <a href="/dashboard/credits">
                      <Button
                        variant="secondary"
                        className="shadow-medium hover-lift bg-white text-purple-600 hover:bg-white"
                      >
                        Adicionar Créditos
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  <CreditCard className="h-24 w-24 text-white/20 hidden lg:block" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <Card className="card-modern border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Documentação da API</CardTitle>
                <CardDescription className="text-base">
                  Aprenda a integrar o CNPJota em seu projeto com exemplos
                  práticos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* API Info */}
                <div className="p-6 bg-linear-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                  <div className="flex items-start gap-4">
                    <div className="icon-wrapper-light">
                      <Code2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">
                        Endpoint da API
                      </h3>
                      <code className="block p-3 bg-white border border-gray-200 rounded-lg font-mono text-sm text-gray-900">
                        {apiUrl}/api/v1/cnpj/&#123;cnpj&#125;
                      </code>
                      <p className="text-sm text-gray-600 mt-3">
                        Substitua{" "}
                        <code className="px-2 py-0.5 bg-white border rounded text-purple-600">
                          &#123;cnpj&#125;
                        </code>{" "}
                        pelo CNPJ que deseja consultar (apenas números).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Authentication */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5 text-purple-600" />
                    Autenticação
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Todas as requisições devem incluir sua API Key no header de
                    autorização:
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`Authorization: Bearer ${apiKey?.key || "sua-api-key-aqui"}`}
                  />
                </div>

                <Separator />

                {/* Code Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-purple-600" />
                    Exemplos de Código
                  </h3>

                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 h-auto gap-2 bg-muted/50 p-2">
                      <TabsTrigger
                        value="javascript"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon
                          language="javascript"
                          className="w-5 h-5"
                        />
                        <span className="hidden sm:inline">JavaScript</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="python"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="python" className="w-5 h-5" />
                        <span className="hidden sm:inline">Python</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="php"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="php" className="w-5 h-5" />
                        <span className="hidden sm:inline">PHP</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="java"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="java" className="w-5 h-5" />
                        <span className="hidden sm:inline">Java</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="go"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="go" className="w-5 h-5" />
                        <span className="hidden sm:inline">Go</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="ruby"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="ruby" className="w-5 h-5" />
                        <span className="hidden sm:inline">Ruby</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="csharp"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="csharp" className="w-5 h-5" />
                        <span className="hidden sm:inline">C#</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="curl"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft"
                      >
                        <LanguageIcon language="curl" className="w-5 h-5" />
                        <span className="hidden sm:inline">cURL</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript" className="space-y-4 mt-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F7DF1E]/20 bg-[#F7DF1E]/10 text-sm font-medium">
                        <LanguageIcon
                          language="javascript"
                          className="w-5 h-5"
                        />
                        JavaScript / Node.js
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando fetch API (Node.js 18+ ou navegador):
                      </p>
                      <CodeBlock
                        language="javascript"
                        code={`const apiKey = '${apiKey?.key || "sua-api-key-aqui"}';
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando a biblioteca requests:
                      </p>
                      <CodeBlock
                        language="python"
                        code={`import requests

api_key = '${apiKey?.key || "sua-api-key-aqui"}'
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando cURL do PHP:
                      </p>
                      <CodeBlock
                        language="php"
                        code={`<?php
$apiKey = '${apiKey?.key || "sua-api-key-aqui"}';
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando HttpClient:
                      </p>
                      <CodeBlock
                        language="java"
                        code={`import java.net.http.*;
import java.net.URI;

String apiKey = "${apiKey?.key || "sua-api-key-aqui"}";
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
                      <p className="text-sm text-gray-600 mt-3">
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
    apiKey := "${apiKey?.key || "sua-api-key-aqui"}"
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando Net::HTTP:
                      </p>
                      <CodeBlock
                        language="ruby"
                        code={`require 'net/http'
require 'json'

api_key = '${apiKey?.key || "sua-api-key-aqui"}'
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando HttpClient:
                      </p>
                      <CodeBlock
                        language="csharp"
                        code={`using System;
using System.Net.Http;
using System.Threading.Tasks;

var apiKey = "${apiKey?.key || "sua-api-key-aqui"}";
var cnpj = "00000000000191";

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

var response = await client.GetAsync(
    $"${apiUrl}/api/v1/cnpj/{cnpj}"
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
                      <p className="text-sm text-gray-600 mt-3">
                        Exemplo usando cURL no terminal:
                      </p>
                      <CodeBlock
                        language="bash"
                        code={`curl -X GET "${apiUrl}/api/v1/cnpj/00000000000191" \\
  -H "Authorization: Bearer ${apiKey?.key || "sua-api-key-aqui"}"`}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator />

                {/* Response Structure */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Estrutura de Resposta
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    A API retorna os dados da empresa em formato JSON
                    estruturado:
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
    "cnae": {
      "principal": {
        "codigo": "6201-5/00",
        "descricao": "Desenvolvimento de programas de computador sob encomenda"
      },
      "secundarios": [
        {
          "codigo": "6202-3/00",
          "descricao": "Desenvolvimento e licenciamento de programas de computador customizáveis"
        }
      ]
    },
    "endereco": {
      "logradouro": "RUA EXEMPLO",
      "numero": "123",
      "complemento": "SALA 45",
      "bairro": "CENTRO",
      "municipio": "SÃO PAULO",
      "uf": "SP",
      "cep": "01234-567"
    },
    "contato": {
      "telefone": "(11) 1234-5678",
      "email": "contato@exemplo.com.br"
    }
  }
}`}
                  />
                </div>

                <Separator />

                {/* Best Practices */}
                <div className="p-6 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Check className="h-5 w-5 text-green-600" />
                    Boas Práticas
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Segurança:</strong> Nunca exponha sua API Key em
                        repositórios públicos ou código front-end
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Rate Limiting:</strong> Respeite o limite de
                        requisições para garantir a estabilidade da API
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Tratamento de Erros:</strong> Sempre valide a
                        resposta da API e trate possíveis erros adequadamente
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Cache:</strong> Implemente cache para CNPJs
                        consultados frequentemente e economize créditos
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Validação:</strong> Valide o formato do CNPJ
                        antes de fazer a requisição (14 dígitos numéricos)
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
