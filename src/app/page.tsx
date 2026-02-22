import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  ArrowRight,
  BarChart,
  Check,
  Code2,
  Database,
  Globe,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  <img
                    src="/cnpjota.png"
                    alt="CNPJota"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </span>
              </div>
              <span className="text-xl font-bold gradient-text">CNPJota</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="#features"
                className="hidden sm:block text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Recursos
              </Link>
              <Link
                href="#pricing"
                className="hidden sm:block text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Preços
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="gradient-purple text-white shadow-medium hover-lift"
                >
                  Começar Grátis
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-dark">
        {/* Animated background mesh */}
        <div className="hero-mesh" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="relative container mx-auto px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left column - Copy */}
            <div className="space-y-8">
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Novo: Cache com TTL configurável
                </div>
              </div>

              <div className="animate-slide-up space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                  Dados de CNPJ{" "}
                  <span className="hero-gradient-text">em uma linha</span> de
                  código
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-xl text-balance">
                  API REST com 4 fontes de dados, fallback automático e cache
                  inteligente. Integre em minutos, pague só pelo que usar.
                </p>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-3 animate-fade-in">
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  &lt;200ms de resposta
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
                  <Globe className="h-3 w-3 text-blue-400" />4 fontes de dados
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
                  <Lock className="h-3 w-3 text-green-400" />
                  99.9% de uptime
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gradient-purple text-white shadow-purple hover-lift h-13 px-8 text-base font-semibold"
                  >
                    Criar conta grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-purple-600 hover:bg-white/10 hover:text-white hover:border-white/30 h-13 px-8 text-base"
                  >
                    Ver documentação
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <p className="text-sm text-gray-500 animate-fade-in">
                ✓ Grátis para começar &nbsp;·&nbsp; ✓ 5 créditos na criação
                &nbsp;·&nbsp; ✓ Sem cartão de crédito
              </p>
            </div>

            {/* Right column - Code mockup */}
            <div className="animate-slide-in-right hidden lg:block">
              <div className="code-terminal">
                {/* Terminal header */}
                <div className="code-terminal-header">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-500 font-medium">
                      cnpjota.ts
                    </span>
                  </div>
                </div>

                {/* Code body */}
                <div className="code-body">
                  <div className="code-line">
                    <span className="code-ln">1</span>
                    <span className="code-keyword">const</span>
                    <span className="code-var"> res </span>
                    <span className="code-op">=</span>
                    <span className="code-keyword"> await </span>
                    <span className="code-fn">fetch</span>
                    <span className="code-punct">(</span>
                  </div>
                  <div className="code-line">
                    <span className="code-ln">2</span>
                    <span className="code-indent" />
                    <span className="code-str">
                      `https://api.cnpjota.com/cnpj/
                    </span>
                    <span className="code-tmpl">
                      {"{"}cnpj{"}"}
                    </span>
                    <span className="code-str">`</span>
                    <span className="code-punct">,</span>
                  </div>
                  <div className="code-line">
                    <span className="code-ln">3</span>
                    <span className="code-indent" />
                    <span className="code-punct">{"{"}</span>
                    <span className="code-prop"> headers</span>
                    <span className="code-punct">:</span>
                    <span className="code-punct"> {"{"}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-ln">4</span>
                    <span className="code-indent" />
                    <span className="code-indent" />
                    <span className="code-prop">Authorization</span>
                    <span className="code-punct">:</span>
                    <span className="code-str"> `Bearer </span>
                    <span className="code-tmpl">
                      {"{"}apiKey{"}"}
                    </span>
                    <span className="code-str">`</span>
                  </div>
                  <div className="code-line">
                    <span className="code-ln">5</span>
                    <span className="code-indent" />
                    <span className="code-punct">{"}"} )</span>
                  </div>
                  <div className="code-line mt-2">
                    <span className="code-ln">6</span>
                    <span className="code-keyword">const</span>
                    <span className="code-var"> data </span>
                    <span className="code-op">=</span>
                    <span className="code-keyword"> await </span>
                    <span className="code-var">res</span>
                    <span className="code-punct">.</span>
                    <span className="code-fn">json</span>
                    <span className="code-punct">()</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 mx-4" />

                {/* Response preview */}
                <div className="code-body">
                  <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                    Response
                  </div>
                  <div className="response-block">
                    <div className="code-line">
                      <span className="code-punct">{"{"}</span>
                    </div>
                    <div className="code-line">
                      <span className="code-indent" />
                      <span className="code-prop">"razao_social"</span>
                      <span className="code-punct">: </span>
                      <span className="code-str">
                        "Empresa Tecnologia LTDA"
                      </span>
                      <span className="code-punct">,</span>
                    </div>
                    <div className="code-line">
                      <span className="code-indent" />
                      <span className="code-prop">"situacao_cadastral"</span>
                      <span className="code-punct">: </span>
                      <span className="code-active">"ATIVA"</span>
                      <span className="code-punct">,</span>
                    </div>
                    <div className="code-line">
                      <span className="code-indent" />
                      <span className="code-prop">"uf"</span>
                      <span className="code-punct">: </span>
                      <span className="code-str">"SP"</span>
                      <span className="code-punct">,</span>
                    </div>
                    <div className="code-line">
                      <span className="code-indent" />
                      <span className="code-prop">"cnae_principal"</span>
                      <span className="code-punct">: </span>
                      <span className="code-str">"62.01-5-01"</span>
                    </div>
                    <div className="code-line">
                      <span className="code-punct">{"}"}</span>
                      <span className="code-cursor" />
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="code-statusbar">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-green-400">200 OK</span>
                  </div>
                  <span className="text-gray-600">138ms</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-600">1 crédito</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="flex gap-3 mt-4 justify-end">
                <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 text-xs text-green-400 font-medium">
                  <Check className="h-3 w-3" />
                  CNPJ Válido
                </div>
                <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5 text-xs text-purple-400 font-medium">
                  <Database className="h-3 w-3" />
                  Cache hit
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-white/3 px-8 py-6 text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-500 mt-1">Uptime SLA</div>
              </div>
              <div className="bg-white/3 px-8 py-6 text-center border-x border-white/5">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-sm text-gray-500 mt-1">
                  Fontes com fallback
                </div>
              </div>
              <div className="bg-white/3 px-8 py-6 text-center">
                <div className="text-3xl font-bold text-white">&lt;200ms</div>
                <div className="text-sm text-gray-500 mt-1">Latência média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="badge-modern mb-4">Recursos</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher <span className="gradient-text">CNPJota</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto text-balance">
              Recursos pensados para desenvolvedores que buscam qualidade e
              performance
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <div className="card-modern p-8 animate-slide-up stagger-delay-1">
              <div className="icon-wrapper mb-6">
                <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-semibold">
                  R
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Super Rápido
              </h3>
              <p className="text-gray-600">
                Cache inteligente e otimizações garantem respostas em
                milissegundos. Performance que escala com seu negócio.
              </p>
            </div>

            <div className="card-modern p-8 animate-slide-up stagger-delay-2">
              <div className="icon-wrapper mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seguro</h3>
              <p className="text-gray-600">
                Autenticação via API Key, rate limiting inteligente e
                monitoramento constante para proteger seus dados.
              </p>
            </div>

            <div className="card-modern p-8 animate-slide-up stagger-delay-3">
              <div className="icon-wrapper mb-6">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sempre Disponível
              </h3>
              <p className="text-gray-600">
                4 fontes de dados com fallback automático garantem 99.9% de
                uptime. Seus serviços sempre online.
              </p>
            </div>

            <div className="card-modern p-8 animate-slide-up stagger-delay-1">
              <div className="icon-wrapper mb-6">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fácil de Integrar
              </h3>
              <p className="text-gray-600">
                Documentação completa, exemplos em várias linguagens e suporte
                dedicado para começar rápido.
              </p>
            </div>

            <div className="card-modern p-8 animate-slide-up stagger-delay-2">
              <div className="icon-wrapper mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Escalável
              </h3>
              <p className="text-gray-600">
                Sistema de créditos flexível que cresce com seu projeto. De
                startups a grandes empresas.
              </p>
            </div>

            <div className="card-modern p-8 animate-slide-up stagger-delay-3">
              <div className="icon-wrapper mb-6">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Analytics Detalhado
              </h3>
              <p className="text-gray-600">
                Acompanhe todas as suas consultas com dashboard completo e
                relatórios em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-purple-light relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="badge-modern mb-4">
              <TrendingUp className="h-3 w-3 mr-1" />
              Preços
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Pacotes de créditos que{" "}
              <span className="gradient-text">crescem com você</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto text-balance">
              Escolha o pacote ideal para suas necessidades. Sem taxas ocultas.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Básico */}
            <div className="card-modern p-8 bg-white">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pacote Básico
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    R$ 10
                  </span>
                </div>
                <p className="text-gray-600">Ideal para começar</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-semibold">
                    100 créditos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">R$ 0,10 por crédito</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">~300 consultas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Suporte por email</span>
                </li>
              </ul>

              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 shadow-soft hover-lift"
                >
                  Comprar Agora
                </Button>
              </Link>
            </div>

            {/* Intermediário - Popular */}
            <div className="card-modern p-8 bg-white border-2 border-purple-500 relative shadow-large scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="badge-modern bg-gradient-purple text-white border-0 shadow-medium">
                  Mais Popular
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pacote Intermediário
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold gradient-text">
                    R$ 45
                  </span>
                </div>
                <p className="text-gray-600">Melhor custo-benefício</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-semibold">
                    500 créditos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">R$ 0,09 por crédito</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">~1.500 consultas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Economia de 10%</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Suporte por email</span>
                </li>
              </ul>

              <Link href="/login" className="block">
                <Button className="w-full h-12 gradient-purple text-white shadow-large hover-lift">
                  Comprar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="card-modern p-8 bg-white">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pacote Premium
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    R$ 80
                  </span>
                </div>
                <p className="text-gray-600">Para uso intensivo</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-semibold">
                    1.000 créditos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">R$ 0,08 por crédito</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">~3.000 consultas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Economia de 20%</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Suporte por email</span>
                </li>
              </ul>

              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 shadow-soft hover-lift"
                >
                  Comprar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="card-modern-elevated p-12 md:p-16 text-center gradient-purple relative overflow-hidden">
            <div className="bg-grid absolute inset-0 opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Pronto para <span className="gradient-text">começar?</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto text-balance">
                Crie sua conta gratuitamente e ganhe 5 créditos para testar a
                API. Sem cartão de crédito necessário.
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-large hover-lift h-14 px-10 bg-white text-purple-600 hover:bg-white"
                >
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/cnpjota.png"
                alt="CNPJota"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-bold gradient-text">CNPJota</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-600">
              <Link
                href="#"
                className="hover:text-purple-600 transition-colors"
              >
                Documentação
              </Link>
              <Link
                href="#"
                className="hover:text-purple-600 transition-colors"
              >
                API
              </Link>
              <Link
                href="#"
                className="hover:text-purple-600 transition-colors"
              >
                Suporte
              </Link>
              <Link
                href="#"
                className="hover:text-purple-600 transition-colors"
              >
                Status
              </Link>
            </div>

            <div className="text-sm text-gray-600">
              © 2025 CNPJota. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
