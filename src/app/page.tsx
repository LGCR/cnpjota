import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Clock, 
  Code2, 
  TrendingUp,
  Check,
  ArrowRight,
} from 'lucide-react';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-purple-500/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="glass mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              API de Consulta de CNPJ
            </Badge>
            
            <h1 className="text-6xl font-bold tracking-tight animate-slide-up">
              Consulte CNPJs de forma{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                simples e rápida
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              API moderna com sistema de créditos, cache inteligente e múltiplas fontes de dados. 
              Comece em minutos.
            </p>

            <div className="flex gap-4 justify-center pt-4 animate-slide-up">
              <Link href="/login">
                <Button size="lg" className="gradient-purple text-white shadow-xl hover-lift">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="glass">
                  Ver Recursos
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">4</div>
                <div className="text-sm text-muted-foreground">Fontes de Dados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">&lt;500ms</div>
                <div className="text-sm text-muted-foreground">Tempo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Por que escolher CNPJota?</h2>
          <p className="text-muted-foreground text-lg">Recursos pensados para desenvolvedores</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 w-fit rounded-xl mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Super Rápido</h3>
              <p className="text-muted-foreground">
                Cache inteligente e otimizações garantem respostas em milissegundos.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 w-fit rounded-xl mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguro</h3>
              <p className="text-muted-foreground">
                Autenticação via API Key, rate limiting e monitoramento constante.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 w-fit rounded-xl mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sempre Disponível</h3>
              <p className="text-muted-foreground">
                Múltiplas fontes com fallback automático garantem 99.9% de uptime.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 w-fit rounded-xl mb-4">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fácil de Integrar</h3>
              <p className="text-muted-foreground">
                Exemplos de código em várias linguagens e documentação completa.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 w-fit rounded-xl mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Escalável</h3>
              <p className="text-muted-foreground">
                Sistema de créditos flexível que cresce com seu projeto.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift">
            <CardContent className="pt-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 w-fit rounded-xl mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Moderno</h3>
              <p className="text-muted-foreground">
                API REST moderna, bem documentada e seguindo as melhores práticas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Planos Simples</h2>
          <p className="text-muted-foreground text-lg">Escolha o melhor para você</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="glass-card border-0">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">Grátis</span>
                <span className="text-muted-foreground">/sempre</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">100 créditos de boas-vindas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">0.33 créditos/consulta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">2 requisições/segundo</span>
                </li>
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-2 border-purple-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-2">Profissional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">R$ 49</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">10.000 créditos/mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">0.25 créditos/consulta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">5 requisições/segundo</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full gradient-purple">
                  Assinar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">R$ 199</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">50.000 créditos/mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">0.20 créditos/consulta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">10 requisições/segundo</span>
                </li>
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Falar com Vendas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="glass-card border-0 gradient-purple text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <CardContent className="relative py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Crie sua conta gratuitamente e ganhe 100 créditos para testar a API.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="shadow-xl hover-lift">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CNPJota. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
