import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { AIFeatureSection } from "@/components/landing/AIFeatureSection";
import { ClassroomValueSection } from "@/components/landing/ClassroomValueSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "AvaliaTech — Crie provas de forma rápida, inteligente e profissional",
  description:
    "Plataforma completa para professores: banco de questões, geração de provas A/B em PDF com gabaritos automáticos e assistência de inteligência artificial."
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07131C] text-[#F8FAFC] antialiased selection:bg-[#F5B82E] selection:text-[#07131C]">
      {/* Top Navigation */}
      <LandingNavbar />

      {/* Main Page Flow */}
      <main id="conteudo-principal">
        {/* 1. Hero Section with Copy and Visual Product Mockup */}
        <HeroSection />

        {/* 2. Features: Por que AvaliaTech? */}
        <FeaturesSection />

        {/* 3. Como Funciona: 4-step workflow */}
        <HowItWorksSection />

        {/* 4. IA Integrada: Specialized generative questions section */}
        <AIFeatureSection />

        {/* 5. Pensado para a sala de aula: Educational Value */}
        <ClassroomValueSection />

        {/* 6. Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* Global Footer */}
      <LandingFooter />
    </div>
  );
}
