"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileCheck2, Menu, X, ArrowRight } from "lucide-react";

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
          ? "bg-[#07131C]/90 backdrop-blur-md border-b border-[#1E3448]/80 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-[#1E3448]/40"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#112433] to-[#0D1B26] border border-[#1E3448] text-[#F5B82E] shadow-sm transition group-hover:border-[#F5B82E]/50 group-hover:shadow-[0_0_15px_rgba(245,184,46,0.15)]">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC] group-hover:text-white transition">
                Avalia<span className="text-[#F5B82E]">Tech</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-[#AAB8C5]">
                Central de Avaliações
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#inicio"
              className="text-sm font-medium text-[#AAB8C5] hover:text-[#F8FAFC] transition"
            >
              Início
            </Link>
            <Link
              href="#recursos"
              className="text-sm font-medium text-[#AAB8C5] hover:text-[#F8FAFC] transition"
            >
              Recursos
            </Link>
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-[#AAB8C5] hover:text-[#F8FAFC] transition"
            >
              Como funciona
            </Link>
            <Link
              href="#sobre"
              className="text-sm font-medium text-[#AAB8C5] hover:text-[#F8FAFC] transition"
            >
              Sobre
            </Link>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] hover:text-[#F5B82E] hover:bg-[#112433] transition border border-transparent hover:border-[#1E3448]"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5B82E] px-5 py-2.5 text-sm font-bold text-[#07131C] shadow-md shadow-[#F5B82E]/10 transition hover:bg-[#e5a81f] hover:shadow-[0_0_20px_rgba(245,184,46,0.25)] active:scale-[0.98]"
            >
              Cadastrar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E3448] bg-[#0D1B26] text-[#F8FAFC] transition hover:border-[#F5B82E]/50"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E3448] bg-[#07131C]/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium text-[#F8FAFC] hover:bg-[#0D1B26] hover:text-[#F5B82E] transition"
            >
              Início
            </Link>
            <Link
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium text-[#F8FAFC] hover:bg-[#0D1B26] hover:text-[#F5B82E] transition"
            >
              Recursos
            </Link>
            <Link
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium text-[#F8FAFC] hover:bg-[#0D1B26] hover:text-[#F5B82E] transition"
            >
              Como funciona
            </Link>
            <Link
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium text-[#F8FAFC] hover:bg-[#0D1B26] hover:text-[#F5B82E] transition"
            >
              Sobre
            </Link>

            <div className="pt-4 border-t border-[#1E3448] flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-[#1E3448] bg-[#0D1B26] py-3 text-center text-sm font-bold text-[#F8FAFC] hover:bg-[#112433] transition"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#F5B82E] py-3 text-center text-sm font-bold text-[#07131C] shadow-md transition hover:bg-[#e5a81f]"
              >
                Cadastrar agora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

