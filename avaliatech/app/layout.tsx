import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "AvaliaTech",
  description: "Sistema para criação de provas com questões, versões e gabarito automático."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var saved = localStorage.getItem('avaliatech-theme');
                var theme = saved || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                document.documentElement.style.colorScheme = theme;
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
