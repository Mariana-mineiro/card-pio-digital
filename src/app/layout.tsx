import { QueryProvider } from "@/components/ui/providers/query-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Rancho mineiro",
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
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}