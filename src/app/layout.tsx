import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CNPJota - Consulta de CNPJ Simplificada",
  description:
    "API moderna de consulta de CNPJ com sistema de créditos, cache inteligente e múltiplas fontes de dados",
  icons: {
    icon: "/cnpjota.png",
    shortcut: "/cnpjota.png",
    apple: "/cnpjota.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
