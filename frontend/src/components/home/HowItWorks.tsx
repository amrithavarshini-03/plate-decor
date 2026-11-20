"use client";

import React, { useState } from "react";
import { MessageSquare, Palette, Sparkles, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: "01",
      title: t.processSection.step1Title,
      desc: t.processSection.step1Desc,
      icon: MessageSquare,
      plateLayer: "Golden Rim & Foundation",
      plateLayerDesc: "The sacred boundary is drawn; heirloom brass trays are selected.",
      visualColor: "#E4C580",
    },
    {
      stepNumber: "02",
      title: t.processSection.step2Title,
      desc: t.processSection.step2Desc,
      icon: Palette,
      plateLayer: "Fresh Plantain Leaf Base",
      plateLayerDesc: "Cool plantain leaves are trimmed to fit the circular geometry.",
      visualColor: "#2F5D3A",
    },
    {
      stepNumber: "03",
      title: t.processSection.step3Title,
      desc: t.processSection.step3Desc,
      icon: Sparkles,
      plateLayer: "Concentric Blooms & Fruits",
      plateLayerDesc: "Marigold, rose petals, carved lemons and pomegranates take their place.",
      visualColor: "#E9A62B",
    },
    {
      stepNumber: "04",
      title: t.processSection.step4Title,
      desc: t.processSection.step4Desc,
      icon: Building2,
      plateLayer: "Mandapam Stage Presence",
      plateLayerDesc: "Polished to perfection on the stage before your first guest arrives.",
      visualColor: "#A8232F",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <span>{t.processSection.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          {t.processSection.title}
        </h2>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.processSection.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Step Cards */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={item.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex items-start gap-5 ${
                  isActive
                    ? "bg-[#FFFDF9] border-[#2F5D3A] shadow-md -translate-y-1"
                    : "bg-[#FFFDF9]/60 border-[#E8DAC8] hover:bg-[#FFFDF9]"
                }`}
              >
                {/* Step badge */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isActive
                      ? "bg-[#2F5D3A] text-[#FBF6EC] border-[#214229]"
                      : "bg-[#FAF3E7] text-[#635166] border-[#E8DAC8]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E9A62B]">{item.stepNumber}</span>
                    <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#635166] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Plate Assembling Graphic */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#E4C580] bg-[#FFFDF9] shadow-2xl flex items-center justify-center p-4">
            {/* Layer 1: Golden Rim */}
            <div className={`absolute inset-2 rounded-full border-2 border-dashed border-[#C8A86B] transition-opacity duration-500 ${activeStep >= 0 ? "opacity-100" : "opacity-30"}`} />

            {/* Layer 2: Plantain Leaf Circle */}
            <div
              className={`absolute inset-6 rounded-full bg-[#2F5D3A] transition-all duration-700 ${
                activeStep >= 1 ? "scale-100 opacity-90" : "scale-75 opacity-0"
              }`}
            />

            {/* Layer 3: Concentric Marigold Garland */}
            <div
              className={`absolute inset-12 rounded-full border-8 border-[#E9A62B] transition-all duration-700 ${
                activeStep >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />

            {/* Layer 4: Kumkum Red Auspicious Centerpiece */}
            <div
              className={`w-20 h-20 rounded-full bg-[#A8232F] border-4 border-[#FFFDF9] shadow-lg flex items-center justify-center z-10 transition-all duration-500 ${
                activeStep >= 3 ? "scale-100 opacity-100" : "scale-50 opacity-40"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#FFFDF9]" />
            </div>

            {/* Step Caption floating below */}
            <div className="absolute -bottom-10 bg-[#FFFDF9] border border-[#E8DAC8] px-4 py-2 rounded-full shadow-md text-center max-w-[260px]">
              <p className="text-[11px] font-bold text-[#2F5D3A] uppercase tracking-wider">
                {steps[activeStep].plateLayer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
