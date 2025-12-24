'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Github, Sparkles, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-purple-500/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-6 animate-slide-in-right">
          <div className="space-y-2">
            <Badge variant="secondary" className="glass mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              API de Consulta de CNPJ
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight">
              Bem-vindo ao{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CNPJota
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A forma mais simples e rápida de consultar CNPJs com uma API moderna
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3 glass-card p-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Super Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Respostas em milissegundos com cache inteligente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 glass-card p-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Seguro e Confiável</h3>
                <p className="text-sm text-muted-foreground">
                  Autenticação robusta e 99.9% de uptime
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 glass-card p-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">100 Créditos Grátis</h3>
                <p className="text-sm text-muted-foreground">
                  Comece agora sem precisar de cartão de crédito
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <Card className="glass-card border-0 shadow-2xl animate-slide-up">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Entrar</CardTitle>
            <CardDescription className="text-base">
              Escolha como deseja continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full h-12 text-base hover-lift"
                size="lg"
                variant="outline"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <Button
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="w-full h-12 text-base hover-lift"
                size="lg"
                variant="outline"
              >
                <Github className="mr-3 h-5 w-5" />
                Continuar com GitHub
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">100</div>
                  <div className="text-xs text-muted-foreground">Créditos Grátis</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <div className="text-xs text-muted-foreground">Fontes de Dados</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
                <p>Ao fazer login, você concorda com nossos</p>
                <p className="text-purple-600 hover:underline cursor-pointer">
                  Termos de Serviço e Política de Privacidade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
