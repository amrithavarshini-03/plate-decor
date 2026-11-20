"use client";

import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { PetalButton } from "@/components/primitives/PetalButton";

export function CtaBanner() {
  const { t } = useLanguage();

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappMessage
  )}`;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#214229] via-[#2F5D3A] to-[#1E3E26] p-10 sm:p-16 text-center text-[#FBF6EC] shadow-2xl overflow-hidden border-2 border-[#E4C580]">
        {/* Subtle decorative concentric rings background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#E9A62B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ceremonial Consultation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF3E7]">
            {t.ctaBanner.title}
          </h2>

          <p className="text-sm sm:text-base text-[#FBF6EC]/80 leading-relaxed">
            {t.ctaBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <PetalButton href="/plan" size="lg" variant="secondary" icon={<Sparkles className="w-4 h-4 text-[#2F5D3A]" />}>
              {t.ctaBanner.primaryCta}
            </PetalButton>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#E8DAC8]/40 bg-white/10 hover:bg-white/20 text-sm font-medium text-[#FBF6EC] transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 text-[#E9A62B]" />
              <span>{t.ctaBanner.whatsappCta}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
