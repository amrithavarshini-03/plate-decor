"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_TESTIMONIALS } from "@/data/mockData";

export function HomeTestimonials() {
  const { language, t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    setCurrentIdx((prev) => (prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIdx((prev) => (prev === MOCK_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const item = MOCK_TESTIMONIALS[currentIdx];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <span>{t.testimonials.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          {t.testimonials.title}
        </h2>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.testimonials.subtitle}
        </p>
      </div>

      {/* Testimonial Tag Tied to a Plate */}
      <div className="relative bg-[#FFFDF9] rounded-3xl border-2 border-[#E4C580] p-8 sm:p-12 shadow-[0_20px_50px_rgba(43,26,46,0.08)] flex flex-col items-center text-center">
        {/* Decorative Auspicious Tag String on Top */}
        <div className="absolute -top-4 w-8 h-8 rounded-full bg-[#FAF3E7] border-2 border-[#E4C580] flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A8232F]" />
        </div>

        {/* 5 Star Rating */}
        <div className="flex items-center gap-1 text-[#E9A62B] mb-6">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>

        {/* Quote text */}
        <Quote className="w-8 h-8 text-[#E8DAC8] mb-4" />
        <p className="font-serif text-xl sm:text-2xl text-[#2B1A2E] italic max-w-2xl leading-relaxed">
          &ldquo;{language === "ta" ? item.textTamil : item.text}&rdquo;
        </p>

        {/* Author metadata */}
        <div className="mt-8 space-y-1">
          <h4 className="font-semibold text-base text-[#2B1A2E]">{item.name}</h4>
          <p className="text-xs text-[#2F5D3A] font-medium">{item.occasion} • {item.city}</p>
          <span className="text-[11px] text-[#635166]">{item.date}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#E8DAC8] bg-[#FAF3E7] hover:bg-[#E4C580]/30 text-[#2B1A2E] flex items-center justify-center transition-colors"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-[#635166] font-medium">
            {currentIdx + 1} / {MOCK_TESTIMONIALS.length}
          </span>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#E8DAC8] bg-[#FAF3E7] hover:bg-[#E4C580]/30 text-[#2B1A2E] flex items-center justify-center transition-colors"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
