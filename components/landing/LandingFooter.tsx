import Link from "next/link";
import { FileCheck2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#1E3448] bg-[#050D14] text-[#AAB8C5] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D1B26] border border-[#1E3448] text-[#F5B82E]">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
                  Avalia<span className="text-[#F5B82E]">Tech</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-[#AAB8C5]">
                  Central de Avaliações
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#AAB8C5] max-w-sm leading-relaxed">
              Criação de avaliações mais simples, organizada e inteligente. Do banco de questões ao PDF pronto para impressão.
            </p>
          </div>

          {/* Links: Produto */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Produto
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#recursos" className="hover:text-[#F5B82E] transition">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="hover:text-[#F5B82E] transition">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="hover:text-[#F5B82E] transition">
                  Sobre a plataforma
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Conta */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Conta
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-[#F5B82E] transition">
                  Entrar no sistema
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-[#F5B82E] transition">
                  Criar conta de professor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1E3448]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#AAB8C5]">
          <p>© 2026 AvaliaTech. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0 text-[11px] text-[#AAB8C5]/70">
            Feito para transformar a rotina docente.
          </p>
        </div>
      </div>
    </footer>
  );
}

