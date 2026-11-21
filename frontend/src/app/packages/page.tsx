"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PetalButton } from "@/components/primitives/PetalButton";

interface PackageTier {
  id: string;
  name: string;
  tamilName: string;
  tagline: string;
  plateCount: number;
  startingPrice: string;
  image: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export default function PackagesPage() {
  const { language } = useLanguage();

  const tiers: PackageTier[] = [
    {
      id: "simple",
      name: "The Shubh Plate Set",
      tamilName: "சுப தட்டுத் தொகுப்பு",
      tagline: "Essential auspicious plates for intimate home poojas and family milestones.",
      plateCount: 5,
      startingPrice: "Formal Quote on Request",
      image: "/images/decor/sacred_kalasam_ganesha_mandala.jpg",
      features: [
        "Set of 5 arranged decorative brass thaalams",
        "Concentric fresh marigold & tuberose rings",
        "Whole seasonal fruits & virali manjal roots",
        "Silver & betel leaf pooja presentation",
        "Pre-assembled delivery to your venue",
      ],
    },
    {
      id: "signature",
      name: "The Mandapam Array",
      tamilName: "மண்டப சீர்வரிசைத் தொகுப்பு",
      tagline: "Our most requested collection for Puberty and Wedding ceremonies.",
      plateCount: 11,
      startingPrice: "Formal Quote on Request",
      image: "/images/decor/sevvazhai_golden_lotus.jpg",
      popular: true,
      badge: "Most Celebrated",
      features: [
        "Set of 11 grand ceremonial thaalams",
        "Intricate carved fruit mandalas (pomegranate & melon)",
        "Premium dry fruit floral plate (almonds & cashews)",
        "Fresh Madurai Malli (jasmine) flower garlands",
        "Custom silk plate linings matching your saree color",
        "On-site decorator setup 2 hours before muhurtham",
      ],
    },
    {
      id: "grand",
      name: "The Royal Seer Varisai",
      tamilName: "ராஜகம்பீர சீர்வரிசைத் தொகுப்பு",
      tagline: "The pinnacle of ceremonial plating, including stage backdrop and heirloom craftsmanship.",
      plateCount: 21,
      startingPrice: "Formal Quote on Request",
      image: "/images/decor/valaikappu_full_stage_backdrop.jpg",
      features: [
        "Set of 21 opulent seer varisai plates",
        "Royal dry fruit peacock centerpiece with silver leaf",
        "Carved melon swans, dry fruit towers & sweets pyramids",
        "Full ceremonial stage backdrop (banana trees & marigold ropes)",
        "Brass urlis with floating lotus blossoms and candles",
        "Dedicated senior decorator team managing entire stage presence",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>Curated Ceremonial Tiers</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1A2E]">
          Celebration Packages
        </h1>
        <p className="text-sm sm:text-base text-[#635166] leading-relaxed">
          From intimate 5-plate family poojas to majestic 21-plate royal wedding seer arrays. Each tier represents an increasingly abundant thaalam arrangement.
        </p>
      </div>

      {/* 3 Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
              tier.popular
                ? "bg-[#FFFDF9] border-2 border-[#2F5D3A] shadow-xl hover:-translate-y-2"
                : "bg-[#FFFDF9] border border-[#E8DAC8] shadow-sm hover:shadow-lg"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2F5D3A] text-[#FBF6EC] px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                {tier.badge}
              </div>
            )}

            <div className="space-y-6">
              {/* Plate Visual Header */}
              <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-[#E4C580] overflow-hidden bg-[#FAF5EE] shadow-inner p-2">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={tier.image} alt={tier.name} fill className="object-cover" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E9A62B]">
                  {tier.plateCount} Decorative Plates
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  {language === "ta" ? tier.tamilName : tier.name}
                </h3>
                <p className="text-xs text-[#635166]">{tier.tagline}</p>
              </div>

              <div className="text-center py-2.5 border-y border-[#F4EDE0] space-y-0.5">
                <span className="text-[11px] text-[#635166] block">Pricing Structure</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#2F5D3A] block">
                  {tier.startingPrice}
                </span>
                <span className="text-[10px] text-[#8B5E14] block">
                  50% Advance to Reserve · 50% on Event Day
                </span>
              </div>

              <ul className="space-y-2.5 pt-2">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#2B1A2E]">
                    <Check className="w-4 h-4 text-[#2F5D3A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled
                className={`w-full py-3 px-6 rounded-full text-xs font-semibold select-none flex items-center justify-center gap-2 cursor-not-allowed ${
                  tier.popular
                    ? "bg-[#2F5D3A]/15 text-[#2F5D3A] border border-[#2F5D3A]/30"
                    : "bg-[#FAF5EE] text-[#635166] border border-[#E8DAC8]"
                }`}
                title="Package customizations coming soon"
              >
                <span>Customize This Package</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
