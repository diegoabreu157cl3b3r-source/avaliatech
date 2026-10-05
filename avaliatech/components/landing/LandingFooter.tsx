import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-navy-750 bg-navy-900 text-slate-400 py-12 sm:py-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3.5">
            <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="AvaliaTech">
              <Logo size="md" />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Criação de avaliações mais simples, organizada e inteligente. Do banco de questões ao PDF pronto para impressão.
            </p>
          </div>

          {/* Links: Produto */}
          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Produto
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link href="#recursos" className="hover:text-gold-400 transition">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="hover:text-gold-400 transition">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="hover:text-gold-400 transition">
                  Sobre a plataforma
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Conta */}
          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Conta
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link href="/login" className="hover:text-gold-400 transition">
                  Entrar no sistema
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-gold-400 transition">
                  Criar conta de professor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-navy-750/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 AvaliaTech. Todos os direitos reservados.</p>
          <p className="mt-1 sm:mt-0 text-[11px] text-slate-400/80">
            Feito para transformar a rotina docente.
          </p>
        </div>
      </div>
    </footer>
  );
}
