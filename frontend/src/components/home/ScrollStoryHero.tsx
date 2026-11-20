"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PetalButton } from "@/components/primitives/PetalButton";

interface SampleImageItem {
  id: number;
  image: string;
  name: string;
  tamilName: string;
  badge: string;
  badgeTamil: string;
  category: string;
  categoryTamil: string;
  desc: string;
  descTamil: string;
  accentColor: string;
}

// The 6 authentic decorative works from the sample_images folder (1.jpeg - 6.jpeg)
const SAMPLE_DECOR_ITEMS: SampleImageItem[] = [
  {
    id: 1,
    image: "/images/decor/1.jpeg?v=1792592109",
    name: "Artisanal Pistachio & Almond Floral Bouquet",
    tamilName: "பிஸ்தா & பாதாம் உலர் பழ மலர் கொத்து",
    badge: "Dry Fruit Thaalam Artistry",
    badgeTamil: "உலர் பழ மலர் அலங்காரம்",
    category: "Wedding & Seer Varisai",
    categoryTamil: "திருமண சீர்வரிசை",
    desc: "Intricately hand-sculpted dry fruit flower blossoms created from whole pistachios, almond petals with pearl centers, accompanied by fresh chrysanthemums on an embossed silver tray.",
    descTamil: "பிஸ்தா மற்றும் பாதாம் பருப்புகளைக் கொண்டு கலைநயத்துடன் செதுக்கப்பட்ட மலர் வடிவங்கள், முத்து அலங்காரம் மற்றும் சாமந்தி மலர்களுடன் கூடிய அழகிய வெள்ளித் தட்டு அலங்காரம்.",
    accentColor: "#D49E34",
  },
  {
    id: 2,
    image: "/images/decor/2.jpeg?v=1792592109",
    name: "Auspicious Valaikappu Baby Footprint Kalkandu Tray",
    tamilName: "வளைகாப்பு குழந்தை பாத கற்கண்டுத் தட்டு",
    badge: "Valaikappu & Seemantham",
    badgeTamil: "வளைகாப்பு & சீமந்தம்",
    category: "Baby Shower Ceremony",
    categoryTamil: "வளைகாப்பு விழா",
    desc: "Tender baby footprints arranged with fresh mandarin orange segments and ruby pomegranate seeds on a betel leaf, resting on a bed of sparkling rock sugar crystals framed by banana leaf cones and jasmine buds.",
    descTamil: "வெற்றிலையின் மேல் ஆரஞ்சு மற்றும் மாதுளை முத்துகளால் அமைக்கப்பட்ட மங்கலக் குழந்தை பாதம், கற்கண்டுப் படுகை மற்றும் மல்லிகை அரும்புகள் கொண்ட வாழை இலைத் தட்டு.",
    accentColor: "#2F5D3A",
  },
  {
    id: 3,
    image: "/images/decor/3.jpeg?v=1792592109",
    name: "Gilded Sevvazhai & Golden Lotus Thaalam",
    tamilName: "பொன் தாமரை & அலங்கார செவ்வாழைத் தட்டு",
    badge: "Manjal Neerattu Vizha",
    badgeTamil: "மஞ்சள் நீராட்டு விழா",
    category: "Puberty Ceremony",
    categoryTamil: "மங்கல மஞ்சள் நீராட்டு",
    desc: "Auspicious red bananas (செவ்வாழை) accented with studded golden bead lines and sapphire jewels, radiating around a shimmering golden lotus centerpiece on an antique filigree silver tray.",
    descTamil: "தங்க மணி மாலைகள் மற்றும் நீல மணிகள் பதிக்கப்பட்ட செவ்வாழைப் பழங்கள், பொன் தாமரை மலர் மகுடத்துடன் பாரம்பரிய வெள்ளித் தட்டில் கம்பீரமான அலங்காரம்.",
    accentColor: "#E9A62B",
  },
  {
    id: 4,
    image: "/images/decor/4.jpeg?v=1792592109",
    name: "Miniature Golden Krishna in Beaded Arch Swing",
    tamilName: "கற்கண்டுப் படுகையில் கண்ணன் மலர் தொட்டில்",
    badge: "Seemantham Cradle Decor",
    badgeTamil: "சீமந்த மங்கலத் தொட்டில்",
    category: "Baby Shower & Valaikappu",
    categoryTamil: "வளைகாப்பு & சீமந்தம்",
    desc: "Golden Balakrishna enshrined in an ornate ceremonial swing with red and blue glass beads and a brass bell, resting on an auspicious bed of sugar crystals (kalkandu).",
    descTamil: "சிவப்பு மற்றும் நீல மணி வேலைப்பாடுகள், கோயில் மணி கொண்ட அழகிய தங்கத் தொட்டிலில் தவழும் பால கண்ணன், இனிப்பான கற்கண்டுப் படுகையில் மங்கலத் தட்டு.",
    accentColor: "#A8232F",
  },
  {
    id: 5,
    image: "/images/decor/5.jpeg?v=1792592109",
    name: "Banana Leaf & Bangle Grid Stage Artistry",
    tamilName: "வளைகாப்பு மேடை & வாழை இலை மாலை அலங்காரம்",
    badge: "Grand Stage Backdrop",
    badgeTamil: "மங்கல மேடை அலங்காரம்",
    category: "Ceremony Stage Decor",
    categoryTamil: "மேடை அலங்காரம்",
    desc: "Grand celebratory stage backdrop featuring lush banana leaf tapestries, cascading marigold garlands, suspended lotus bells, and wooden grid displays of colorful ceremonial glass bangles.",
    descTamil: "செழுமையான வாழை இலைத் திரை, அடர்ந்த சாமந்தி மலர் மாலைகள், தொங்கும் தாமரை மணிகள் மற்றும் பாரம்பரியக் கண்ணாடி வளையல்கள் கொண்ட பிரம்மாண்ட மேடை அலங்காரம்.",
    accentColor: "#1E5838",
  },
  {
    id: 6,
    image: "/images/decor/6.jpeg?v=1792592109",
    name: "Seemantham Expectant Parents Platter",
    tamilName: "சீமந்தத் தம்பதியர் பழங்கள் & ரோஜாத் தட்டு",
    badge: "Bespoke Couple Seer Plate",
    badgeTamil: "தம்பதியர் முகூர்த்த தட்டு",
    category: "Baby Shower Ceremony",
    categoryTamil: "வளைகாப்பு & சீமந்தம்",
    desc: "Artistic cutout of expectant parents in traditional festive attire, elevated above a bed of crowned gala apples, delicate pink roses, baby's breath, and silver filigree rim.",
    descTamil: "பாரம்பரிய பட்டு ஆடையில் பிரசன்னமான தம்பதியர் தோற்றம், சாமந்தி மலர் மகுடம் சூடிய ஆப்பிள்கள், இளஞ்சிவப்பு ரோஜாக்கள் மற்றும் வெண் மலர்களுடன் கூடிய அழகிய தட்டு.",
    accentColor: "#9B2C2C",
  },
];

export function ScrollStoryHero() {
  const { language, t } = useLanguage();

  // Shuffled items state - randomized on every page load/refresh
  const [items, setItems] = useState<SampleImageItem[]>(SAMPLE_DECOR_ITEMS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Randomize order on mount (every page load / refresh)
  const shuffleItems = useCallback(() => {
    const shuffled = [...SAMPLE_DECOR_ITEMS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    shuffleItems();
  }, [shuffleItems]);

  const current = useMemo(() => items[currentIndex] || items[0], [items, currentIndex]);

  // Navigate to next arrangement
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Navigate to previous arrangement
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-rotation every 6.5s
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNext]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial aura matching current active image palette */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full opacity-25 blur-3xl pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: current.accentColor }}
      />

      {/* Floating subtle petals background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-10 w-4 h-4 rounded-full bg-[#E9A62B]/20 animate-petal-drift" />
        <div
          className="absolute bottom-20 right-16 w-5 h-5 rounded-full bg-[#2F5D3A]/20 animate-petal-drift"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-12 w-3 h-3 rounded-full bg-[#A8232F]/15 animate-petal-drift"
          style={{ animationDelay: "3.5s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Column: Poetic Copy & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6">
          {/* Real Work Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] shadow-sm">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: current.accentColor }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2F5D3A]">
              {language === "ta" ? current.badgeTamil : current.badge}
            </span>
            <span className="text-[10px] text-[#A8232F] font-bold px-1.5 py-0.5 rounded bg-[#FAF5EE] border border-[#E8DAC8]">
              {language === "ta" ? "நேரடி அலங்காரம்" : "Real Work"}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B1A2E] leading-[1.12]">
            {t.hero.headline}
          </h1>

          {/* Active Work Title Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-[#8C7A8F] uppercase tracking-wider">
              {language === "ta" ? "சிறப்பு அலங்காரம்:" : "Featured Creation:"}
            </span>
            <div className="px-3.5 py-1.5 rounded-full bg-[#F4EDE0] border border-[#E8DAC8] text-xs font-serif font-bold text-[#2B1A2E] shadow-sm">
              {language === "ta" ? current.tamilName : current.name}
            </div>
          </div>

          {/* Animated Occasion Description */}
          <div className="min-h-[80px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + language}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="space-y-2"
              >
                <p className="text-base sm:text-lg text-[#635166] leading-relaxed max-w-xl">
                  {language === "ta" ? current.descTamil : current.desc}
                </p>
                <p
                  className="text-xs font-semibold transition-colors duration-1000"
                  style={{ color: current.accentColor }}
                >
                  ✦ {language === "ta" ? current.categoryTamil : current.category}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <PetalButton href="/plan" size="lg" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
              {t.hero.beginCta}
            </PetalButton>

            <PetalButton href="/gallery" size="lg" variant="secondary" icon={<Eye className="w-4 h-4" />}>
              {t.hero.browseCta}
            </PetalButton>
          </div>

          {/* Handwritten touch annotation */}
          <div className="flex items-center gap-2 pt-1 text-[#2F5D3A] font-handwriting text-lg italic select-none">
            <span>⤷ hand-arranged with fresh dawn blooms & authentic brass</span>
          </div>
        </div>

        {/* Right Column: Dynamic Chromatic Showcase Frame (Colors match page background & change with its tone) */}
        <div
          className="lg:col-span-6 flex flex-col items-center justify-center w-full"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* THE DYNAMIC CEREMONIAL FRAME */}
          <div className="relative w-full max-w-[520px] aspect-[4/3] sm:aspect-[14/11] flex items-center justify-center">
            {/* Outer Dynamic Fillet - Translucent & tinted with active occasion tone */}
            <div
              className="w-full h-full rounded-3xl p-2.5 sm:p-3 border-2 relative transition-all duration-1000"
              style={{
                borderColor: `${current.accentColor}40`,
                background: `linear-gradient(135deg, ${current.accentColor}12 0%, rgba(255, 253, 249, 0.6) 50%, ${current.accentColor}1A 100%)`,
                boxShadow: `0 20px 45px -10px ${current.accentColor}2A, inset 0 1px 2px rgba(255, 255, 255, 0.8)`,
              }}
            >
              {/* Corner Brass Motifs that take the active tone */}
              <span
                className="absolute top-1.5 left-2.5 text-xs select-none pointer-events-none z-20 transition-colors duration-1000 font-serif"
                style={{ color: current.accentColor }}
              >
                ✦
              </span>
              <span
                className="absolute top-1.5 right-2.5 text-xs select-none pointer-events-none z-20 transition-colors duration-1000 font-serif"
                style={{ color: current.accentColor }}
              >
                ✦
              </span>
              <span
                className="absolute bottom-1.5 left-2.5 text-xs select-none pointer-events-none z-20 transition-colors duration-1000 font-serif"
                style={{ color: current.accentColor }}
              >
                ✦
              </span>
              <span
                className="absolute bottom-1.5 right-2.5 text-xs select-none pointer-events-none z-20 transition-colors duration-1000 font-serif"
                style={{ color: current.accentColor }}
              >
                ✦
              </span>

              {/* Inner Canvas - Seamlessly translucent so home page background & aura flow through! */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden border shadow-inner flex items-center justify-center transition-all duration-1000"
                style={{
                  borderColor: `${current.accentColor}30`,
                  backgroundColor: "rgba(250, 245, 238, 0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {/* Dynamic Ambient Aura matching active color */}
                <div
                  className="absolute inset-0 opacity-18 blur-2xl pointer-events-none transition-colors duration-1000"
                  style={{ backgroundColor: current.accentColor }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`frame-slide-${current.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* Pristine Photograph with Realistic Ceremonial Drop Shadow */}
                    <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4 z-10">
                      <Image
                        src={current.image}
                        alt={current.name}
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 520px"
                        className="object-contain drop-shadow-[0_14px_30px_rgba(43,26,46,0.16)] transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FAF5EE]/90 hover:bg-[#FAF5EE] backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border"
                  style={{ borderColor: `${current.accentColor}40` }}
                  aria-label="Previous decoration"
                >
                  <ArrowLeft className="w-4 h-4 transition-colors duration-1000" style={{ color: current.accentColor }} />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FAF5EE]/90 hover:bg-[#FAF5EE] backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border"
                  style={{ borderColor: `${current.accentColor}40` }}
                  aria-label="Next decoration"
                >
                  <ArrowRight className="w-4 h-4 transition-colors duration-1000" style={{ color: current.accentColor }} />
                </button>
              </div>
            </div>
          </div>

          {/* Clean Dot Navigation Strip (Matches active accent color) */}
          <div className="mt-5 flex items-center gap-2 sm:gap-2.5 z-20">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className="relative transition-all duration-500 rounded-full cursor-pointer"
                style={{
                  width: currentIndex === idx ? "28px" : "8px",
                  height: "8px",
                  backgroundColor: currentIndex === idx ? current.accentColor : "#D8C29D",
                  boxShadow: currentIndex === idx ? `0 0 10px ${current.accentColor}80` : "none",
                }}
                title={language === "ta" ? item.tamilName : item.name}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
