"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-950/90 backdrop-blur-md border-b border-navy-700/80 shadow-md shadow-black/10"
          : "bg-transparent border-b border-navy-700/40"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center transition hover:opacity-90" aria-label="AvaliaTech - Página inicial">
            <Logo size="md" priority />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="#inicio"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition"
            >
              Início
            </Link>
            <Link
              href="#recursos"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition"
            >
              Recursos
            </Link>
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition"
            >
              Como funciona
            </Link>
            <Link
              href="#sobre"
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition"
            >
              Sobre
            </Link>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-100 hover:text-gold-400 hover:bg-navy-850 transition border border-transparent hover:border-navy-700"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-sm font-bold text-white dark:text-navy-950 shadow-sm shadow-gold-500/10 transition hover:bg-gold-400 active:scale-[0.98]"
            >
              Cadastrar
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-700 bg-navy-900 text-slate-100 transition hover:border-gold-500/50"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-700 bg-navy-950/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 hover:bg-navy-850 hover:text-gold-400 transition"
            >
              Início
            </Link>
            <Link
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 hover:bg-navy-850 hover:text-gold-400 transition"
            >
              Recursos
            </Link>
            <Link
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 hover:bg-navy-850 hover:text-gold-400 transition"
            >
              Como funciona
            </Link>
            <Link
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 hover:bg-navy-850 hover:text-gold-400 transition"
            >
              Sobre
            </Link>

            <div className="pt-3 border-t border-navy-700 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-navy-700 bg-navy-900 py-2.5 text-center text-sm font-bold text-slate-100 hover:bg-navy-850 transition"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gold-500 py-2.5 text-center text-sm font-bold text-white dark:text-navy-950 shadow-md transition hover:bg-gold-400"
              >
                Cadastrar agora <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
