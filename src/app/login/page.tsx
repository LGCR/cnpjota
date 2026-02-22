"use client";

import { ArrowLeft, Check, Globe, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleSignIn = (provider: string) => {
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/dashboard")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-dark p-4 relative overflow-hidden">
      {/* Same dark mesh + glows as hero */}
      <div className="hero-mesh" />
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-50 flex items-center gap-1.5 text-gray-500 hover:text-purple-400 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-14 items-center z-10">
        {/* Left — branding + mini terminal */}
        <div className="hidden lg:flex flex-col gap-10 animate-slide-in-left">
          {/* Logo + headline */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  <img
                    src="/cnpjota.png"
                    alt="CNPJota"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </span>
              </div>
              <span className="text-xl font-bold hero-gradient-text">
                CNPJota
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-white leading-tight text-balance">
              Dados de CNPJ{" "}
              <span className="hero-gradient-text">na palma da mão</span>
            </h1>
            <p className="text-gray-400 leading-relaxed text-balance">
              Integre nossa API em minutos e consulte qualquer CNPJ com
              velocidade e confiabilidade.
            </p>
          </div>

          {/* Mini code snippet */}
          <div className="code-terminal">
            <div className="code-terminal-header">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 font-medium">
                  exemplo.ts
                </span>
              </div>
            </div>
            <div className="code-body">
              <div className="code-line">
                <span className="code-ln">1</span>
                <span className="code-keyword">const</span>
                <span className="code-var"> cnpj </span>
                <span className="code-op">=</span>
                <span className="code-str"> "11222333000181"</span>
              </div>
              <div className="code-line">
                <span className="code-ln">2</span>
                <span className="code-keyword">const</span>
                <span className="code-var"> res </span>
                <span className="code-op">=</span>
                <span className="code-keyword"> await </span>
                <span className="code-fn">fetch</span>
                <span className="code-punct">(</span>
              </div>
              <div className="code-line">
                <span className="code-ln">3</span>
                <span className="code-indent" />
                <span className="code-str">`https://api.cnpjota.com/cnpj/</span>
                <span className="code-tmpl">{"{cnpj}"}</span>
                <span className="code-str">`</span>
              </div>
              <div className="code-line">
                <span className="code-ln">4</span>
                <span className="code-punct">)</span>
              </div>
              <div className="code-line mt-2">
                <span className="code-ln">5</span>
                <span className="code-comment">// ✓ Ativa · SP · 138ms</span>
                <span className="code-cursor" />
              </div>
            </div>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
              <Zap className="h-3 w-3 text-yellow-400" />
              &lt;200ms de resposta
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
              <Globe className="h-3 w-3 text-blue-400" />4 fontes com fallback
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
              <Lock className="h-3 w-3 text-green-400" />
              99.9% uptime
            </div>
          </div>
        </div>

        {/* Right — login card (glassmorphism) */}
        <div className="animate-scale-in">
          <div className="login-glass-card">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center shadow-medium">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-xl font-bold hero-gradient-text">
                CNPJota
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-1.5">
                Entrar na sua conta
              </h2>
              <p className="text-gray-400 text-sm">
                Escolha como deseja continuar
              </p>
            </div>

            {/* Auth buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSignIn("google")}
                className="login-btn login-btn-light group"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </button>

              <button
                onClick={() => handleSignIn("github")}
                className="login-btn login-btn-dark group"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continuar com GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-600">grátis para começar</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Perks */}
            <div className="space-y-2.5">
              {[
                "5 créditos grátis ao criar conta",
                "Sem cartão de crédito necessário",
                "Acesso imediato à API",
              ].map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-2.5 text-sm text-gray-400"
                >
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5 text-purple-400" />
                  </div>
                  {perk}
                </div>
              ))}
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-600 mt-7">
              Ao entrar, você concorda com os{" "}
              <Link
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
