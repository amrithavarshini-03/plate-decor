"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Layers, Package, ShoppingBag, HeartHandshake, PhoneCall } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PortalItem {
  href: string;
  badgeTamil: string;
  badgeEn: string;
  titleTamil: string;
  titleEn: string;
  descTamil: string;
  descEn: string;
  image: string;
  icon: React.ReactNode;
  accent: string;
}

export function PagePortalsSection() {
  const { language } = useLanguage();

  const portals: PortalItem[] = [
    {
      href: "/gallery",
      badgeTamil: "புகைப்படத் தொகுப்பு",
      badgeEn: "Ceremonial Portfolio",
      titleTamil: "அலங்கார புகைப்படத் தொகுப்பு",
      titleEn: "Ceremonial Gallery",
      descTamil: "மஞ்சள் நீராட்டு, திருமண சீர்வரிசை, வளைகாப்பு தட்டுகள் மற்றும் மேடை அலங்காரங்களின் 24+ நேரடி புகைப்படங்கள்.",
      descEn: "Explore 24+ authentic handcrafted thaalams, fruit mandalas, and stage backdrops.",
      image: "/images/decor/sevvazhai_golden_lotus.jpg",
      icon: <Sparkles className="w-4 h-4 text-[#E9A62B]" />,
      accent: "#E9A62B",
    },
    {
      href: "/plan",
      badgeTamil: "தட்டு திட்டமிடுதல்",
      badgeEn: "Custom Studio",
      titleTamil: "தட்டு அலங்கார திட்டமிடுதல்",
      titleEn: "Interactive Plate Planner",
      descTamil: "அடித்தள இலை, பழ வரிசை, பொம்மைகள் மற்றும் மலர்களை நீங்கள் விரும்பியபடி தேர்வு செய்து திட்டமிடுங்கள்.",
      descEn: "Customize your ceremonial plate layer by layer with live budget estimation.",
      image: "/images/decor/pistachio_almond_floral_bouquet.jpg",
      icon: <Layers className="w-4 h-4 text-[#2F5D3A]" />,
      accent: "#2F5D3A",
    },
    {
      href: "/packages",
      badgeTamil: "தொகுப்புகள்",
      badgeEn: "All-Inclusive",
      titleTamil: "மங்கல சீர்வரிசை தொகுப்புகள்",
      titleEn: "Ceremonial Packages",
      descTamil: "11 தட்டுகள் முதல் 31 தட்டுகள் வரையிலான முகூர்த்த மற்றும் சீமந்த பிரத்யேக தொகுப்புகள்.",
      descEn: "Curated 11, 21, and 31-plate collections with transparent ceremonial pricing.",
      image: "/images/decor/maappillai_penn_dolls_seer.jpg",
      icon: <Package className="w-4 h-4 text-[#A8232F]" />,
      accent: "#A8232F",
    },
    {
      href: "/shop",
      badgeTamil: "பொருட்கள் வாடகை",
      badgeEn: "Rental & Props",
      titleTamil: "பித்தளை தட்டுகள் & அலங்கார பொருட்கள்",
      titleEn: "Shop & Props",
      descTamil: "செதுக்கப்பட்ட பித்தளை தட்டுகள், குத்துவிளக்குகள், பொம்மைகள் மற்றும் பீடங்கள் வாடகைக்கு.",
      descEn: "Rent authentic temple brass thaalams, kuthuvilakku stands, and ritual props.",
      image: "/images/decor/brass_kuthuvilakku_rose_garland.jpg",
      icon: <ShoppingBag className="w-4 h-4 text-[#C88515]" />,
      accent: "#C88515",
    },
    {
      href: "/about",
      badgeTamil: "எங்கள் வரலாறு",
      badgeEn: "Our Heritage",
      titleTamil: "எங்கள் குடும்ப கலைப் பாரம்பரியம்",
      titleEn: "Our Heritage & Story",
      descTamil: "சென்னையில் கைவண்ணத்துடன் மலரும் தலைமுறை மங்கல அலங்காரக் கலைப் பயணம்.",
      descEn: "Meet our family artisans and discover our dawn-flower arrangement heritage.",
      image: "/images/decor/valaikappu_full_stage_backdrop.jpg",
      icon: <HeartHandshake className="w-4 h-4 text-[#2F5D3A]" />,
      accent: "#2F5D3A",
    },
    {
      href: "/contact",
      badgeTamil: "தேதி பதிவு",
      badgeEn: "Reservations",
      titleTamil: "முன்பதிவு & தொடர்புக்கு",
      titleEn: "Bookings & Contact",
      descTamil: "உங்கள் குடும்ப வைபவத் தேதிக்கான முன்பதிவு மற்றும் வாட்ஸ்அப் உடனடி ஆலோசனை.",
      descEn: "Check wedding date availability on our live calendar or chat directly on WhatsApp.",
      image: "/images/decor/pathinaru_selvangal_coconuts.jpg",
      icon: <PhoneCall className="w-4 h-4 text-[#E9A62B]" />,
      accent: "#E9A62B",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>
            {language === "ta" ? "பிரிவுகள் வாரியாக காண்க" : "Explore by Destination"}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1A2E]">
          {language === "ta"
            ? "ஒவ்வொரு பக்கத்திலும் தனித்துவமான அழகு"
            : "Every Click Opens a New Celebration"}
        </h2>
        <p className="text-sm sm:text-base text-[#635166] leading-relaxed">
          {language === "ta"
            ? "புகைப்படங்கள், தட்டு திட்டமிடுதல், தொகுப்புகள் என தேவையான பக்கத்திற்கு நேரடியாகச் செல்லுங்கள்."
            : "Navigate directly to our dedicated portfolio, interactive custom planner, packages, or booking studio."}
        </p>
      </div>

      {/* Grid of 6 Dedicated Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {portals.map((portal) => (
          <Link
            key={portal.href}
            href={portal.href}
            className="group relative flex flex-col justify-between rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] overflow-hidden shadow-[0_8px_24px_rgba(43,26,46,0.04)] hover:shadow-[0_16px_40px_rgba(43,26,46,0.1)] transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Top Thumbnail Section */}
            <div className="relative h-48 w-full overflow-hidden bg-[#FAF3E7]">
              <Image
                src={portal.image}
                alt={portal.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150617]/70 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E8DAC8] text-[11px] font-semibold text-[#2B1A2E] shadow-sm">
                {portal.icon}
                <span>{language === "ta" ? portal.badgeTamil : portal.badgeEn}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1A2E] group-hover:text-[#2F5D3A] transition-colors flex items-center justify-between">
                  <span>{language === "ta" ? portal.titleTamil : portal.titleEn}</span>
                  <span className="text-[#E9A62B] group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#635166] leading-relaxed line-clamp-2">
                  {language === "ta" ? portal.descTamil : portal.descEn}
                </p>
              </div>

              {/* Card Footer Link Prompt */}
              <div className="pt-2 border-t border-[#F4EDE0] flex items-center justify-between text-xs font-semibold text-[#2F5D3A]">
                <span>
                  {language === "ta" ? "பக்கத்திற்குச் செல்ல" : "Go to page"}
                </span>
                <span className="text-[#E9A62B] font-serif text-sm">➔</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
