import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardápio Digital",
  description:
    "Uma aplicação moderna de cardápio digital com painel administrativo modular.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-stone-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
