"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface OccasionCardData {
  id: string;
  title: string;
  tamilTitle: string;
  image: string;
  accent: string;
  badgeTamil: string;
  badgeEn: string;
}

export function OccasionSelector() {
  const { language, t } = useLanguage();

  const occasions: OccasionCardData[] = [
    {
      id: "puberty",
      title: "Puberty Ceremony",
      tamilTitle: "மஞ்சள் நீராட்டு விழா",
      image: "/images/decor/8.jpeg?v=1792592109",
      accent: "#E9A62B",
      badgeEn: "Ceremonial Thaalam",
      badgeTamil: "மங்கலத் தட்டு",
    },
    {
      id: "wedding",
      title: "Weddings & Engagements",
      tamilTitle: "திருமண சீர்வரிசை & நிச்சயதார்த்தம்",
      image: "/images/decor/9.jpeg?v=1792592109",
      accent: "#A8232F",
      badgeEn: "Kuthuvilakku Decor",
      badgeTamil: "குத்துவிளக்கு அலங்காரம்",
    },
    {
      id: "babyShower",
      title: "Valaikappu & Baby Shower",
      tamilTitle: "வளைகாப்பு & சீமந்தம்",
      image: "/images/decor/10.jpeg?v=1792592109",
      accent: "#2F5D3A",
      badgeEn: "Seemantham Platter",
      badgeTamil: "சீமந்த மங்கலத் தட்டு",
    },
    {
      id: "housewarming",
      title: "Housewarming & Festivals",
      tamilTitle: "புதுமனை புகுவிழா & பண்டிகைகள்",
      image: "/images/decor/11.jpeg?v=1792592109",
      accent: "#C88515",
      badgeEn: "Auspicious Fruits",
      badgeTamil: "மங்கல பழத் தட்டு",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider shadow-sm">
          <span>{t.occasionsSection.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          {t.occasionsSection.title}
        </h2>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.occasionsSection.subtitle}
        </p>
      </div>

      {/* Grid of Display Cards (Non-clickable, Tone-Matched with Home Page Background) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {occasions.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center p-5 sm:p-6 rounded-3xl border select-none transition-all duration-500 hover:scale-[1.02]"
            style={{
              borderColor: `${item.accent}33`,
              background:
                "linear-gradient(180deg, rgba(255, 253, 249, 0.72) 0%, rgba(250, 245, 238, 0.88) 100%)",
              boxShadow: `0 12px 32px -6px ${item.accent}20`,
            }}
          >
            {/* Tone-Matched Showcase Frame with Photo + Decoration Name below photo */}
            <div
              className="relative w-full rounded-2xl p-2 border-2 shadow-sm overflow-hidden mb-4 flex flex-col items-center transition-all duration-500"
              style={{
                borderColor: `${item.accent}40`,
                background: `linear-gradient(135deg, ${item.accent}12 0%, rgba(255, 253, 249, 0.6) 50%, ${item.accent}1A 100%)`,
                boxShadow: `0 10px 24px -5px ${item.accent}24, inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
              }}
            >
              {/* Corner Brass Motifs in Matching Occasion Tone */}
              <span
                className="absolute top-1.5 left-2 text-[10px] select-none pointer-events-none z-20 font-serif"
                style={{ color: item.accent }}
              >
                ✦
              </span>
              <span
                className="absolute top-1.5 right-2 text-[10px] select-none pointer-events-none z-20 font-serif"
                style={{ color: item.accent }}
              >
                ✦
              </span>

              {/* Inner Canvas - Holds the image completely clear with nothing covering it */}
              <div
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center border transition-all duration-500"
                style={{
                  borderColor: `${item.accent}2E`,
                  backgroundColor: "rgba(250, 245, 238, 0.45)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {/* Subtle Occasion Ambient Glow */}
                <div
                  className="absolute inset-0 opacity-15 blur-xl pointer-events-none"
                  style={{ backgroundColor: item.accent }}
                />

                {/* Layer: Full Uncropped Photograph (Nothing floating over it) */}
                <div className="relative w-full h-full flex items-center justify-center p-2.5 z-10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-contain drop-shadow-[0_10px_22px_rgba(43,26,46,0.14)]"
                  />
                </div>
              </div>

              {/* Decoration Name Inside the Frame Below the Image */}
              <div className="w-full pt-2 pb-0.5 flex items-center justify-center">
                <span
                  className="px-3 py-1 rounded-full text-xs font-serif font-bold tracking-wide shadow-xs border"
                  style={{
                    borderColor: `${item.accent}3D`,
                    color: item.accent,
                    backgroundColor: "rgba(255, 253, 249, 0.95)",
                  }}
                >
                  {language === "ta" ? item.badgeTamil : item.badgeEn}
                </span>
              </div>
            </div>

            {/* Content Titles (Tamil & English Namings Alone - No descriptions) */}
            <div className="text-center space-y-1 w-full pt-1">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B1A2E] leading-snug">
                {language === "ta" ? item.tamilTitle : item.title}
              </h3>
              <p
                className="font-serif text-xs sm:text-sm font-semibold"
                style={{ color: item.accent }}
              >
                {language === "ta" ? item.title : item.tamilTitle}
              </p>
            </div>

            {/* Bottom Auspicious Accent Line in matching color */}
            <div
              className="mt-4 w-12 h-1 rounded-full opacity-80"
              style={{ backgroundColor: item.accent }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
