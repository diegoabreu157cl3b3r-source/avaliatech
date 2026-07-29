import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AvaliaTech",
  description: "Sistema para criação de provas com questões, versões e gabarito automático."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
