"use client";

import React from "react";
import { Check, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PetalButton } from "@/components/primitives/PetalButton";

export function CustomerSplit() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <span>{t.customerSplit.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          {t.customerSplit.title}
        </h2>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.customerSplit.subtitle}
        </p>
      </div>

      {/* Two Column Bifurcated Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Card 1: Full Service ("We Do It All") */}
        <div className="relative rounded-3xl bg-[#FFFDF9] border-2 border-[#2F5D3A] p-8 sm:p-10 shadow-[0_16px_40px_rgba(47,93,58,0.08)] flex flex-col justify-between overflow-hidden">
          {/* Top Badge */}
          <div className="absolute top-0 right-0 bg-[#2F5D3A] text-[#FBF6EC] px-6 py-1.5 rounded-bl-2xl text-xs font-semibold tracking-wider uppercase">
            Most Popular
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#2F5D3A]/10 border border-[#2F5D3A]/30 flex items-center justify-center text-[#2F5D3A]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
                {t.customerSplit.fullServiceSub}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E] mt-1">
                {t.customerSplit.fullServiceTitle}
              </h3>
            </div>

            <p className="text-sm text-[#635166] leading-relaxed">
              {t.customerSplit.fullServiceDesc}
            </p>

            <ul className="space-y-3 pt-2">
              {[
                t.customerSplit.fullServicePoint1,
                t.customerSplit.fullServicePoint2,
                t.customerSplit.fullServicePoint3,
              ].map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2B1A2E]">
                  <span className="w-5 h-5 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <PetalButton href="/plan?service=full_service" size="lg" variant="primary" className="w-full">
              {t.customerSplit.fullServiceCta}
            </PetalButton>
          </div>
        </div>

        {/* Card 2: DIY Customers ("You Do It, We Guide You") */}
        <div className="relative rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] p-8 sm:p-10 shadow-[0_16px_40px_rgba(43,26,46,0.04)] flex flex-col justify-between overflow-hidden">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#E9A62B]/15 border border-[#E9A62B]/40 flex items-center justify-center text-[#C88515]">
              <ShoppingBag className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#C88515] uppercase tracking-wider">
                {t.customerSplit.diySub}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E] mt-1">
                {t.customerSplit.diyTitle}
              </h3>
            </div>

            <p className="text-sm text-[#635166] leading-relaxed">
              {t.customerSplit.diyDesc}
            </p>

            <ul className="space-y-3 pt-2">
              {[
                t.customerSplit.diyPoint1,
                t.customerSplit.diyPoint2,
                t.customerSplit.diyPoint3,
              ].map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2B1A2E]">
                  <span className="w-5 h-5 rounded-full bg-[#FAF3E7] border border-[#E4C580] text-[#C88515] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Note about store discounts */}
            <div className="p-3.5 rounded-2xl bg-[#FAF3E7] border border-[#E4C580]/60 text-xs text-[#2B1A2E]">
              <span className="font-semibold text-[#2F5D3A]">Local Store Perks: </span>
              <span>Say our name at partner counters in Chennai & Madurai for direct 10-15% discounts.</span>
            </div>
          </div>

          <div className="pt-8">
            <PetalButton
              href="/shop"
              size="lg"
              variant="secondary"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4 text-[#E9A62B]" />}
            >
              {t.customerSplit.diyCta}
            </PetalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
