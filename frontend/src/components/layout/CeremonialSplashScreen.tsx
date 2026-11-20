"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Sparkles } from "lucide-react";

// The 3 user-specified ceremonial plates: Puberty, Baby Shower, Wedding (Ultra-High-Res AI Generated)
const CEREMONIAL_STAGES = [
  {
    id: 1,
    url: "/images/decor/ai_splash_puberty_plate.jpg",
    alt: "Puberty Ceremony Plate - Manjal Neerattu Vizha",
    tamilName: "மஞ்சள் நீராட்டு விழா",
    englishName: "Puberty Ceremony (Manjal Neerattu Vizha)",
    subtitleTamil: "செதுக்கப்பட்ட பழங்கள், விரலி மஞ்சள் & சாமந்தி மலர் ஆரம்",
    subtitleEn: "Artisanal fruit carvings, sacred turmeric roots & marigold garlands",
    badgeTamil: "மங்கல மஞ்சள் நீராட்டு",
    badgeEn: "Traditional Puberty Decor",
  },
  {
    id: 2,
    url: "/images/decor/ai_splash_baby_shower_plate.jpg",
    alt: "Baby Shower Plate - Valaikappu & Seemantham",
    tamilName: "வளைகாப்பு & சீமந்த விழா",
    englishName: "Valaikappu & Baby Shower",
    subtitleTamil: "வண்ண வளையல்கள், மலர் தொட்டில் & மங்கல தாமரை மலர்கள்",
    subtitleEn: "Auspicious glass bangles, miniature floral cradle & fresh pink lotuses",
    badgeTamil: "மங்கல வளைகாப்பு",
    badgeEn: "Ceremonial Baby Shower",
  },
  {
    id: 3,
    url: "/images/decor/ai_splash_wedding_plate.jpg",
    alt: "Wedding Ceremony Plate - Muhurtham Seer",
    tamilName: "மங்கலத் திருமண முகூர்த்தம்",
    englishName: "Muhurtham & Wedding Ceremony",
    subtitleTamil: "பூரண கும்ப கலசம், மங்கள விளக்குகள், வெற்றிலை & சீர்வரிசை",
    subtitleEn: "Sacred kalasam, twin brass deepams, betel leaves & muhurtham blessings",
    badgeTamil: "கல்யாண முகூர்த்த சீர்",
    badgeEn: "Grand Wedding Seer",
  },
];

export function CeremonialSplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  // stage: 0 = Puberty, 1 = Baby Shower, 2 = Wedding, 3 = BRB Decors (stays 3+ seconds)
  const [stage, setStage] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const handleComplete = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("brb_seen_splash", "true");
    }

    // Grand celebratory petal burst on completion
    try {
      confetti({
        particleCount: 55,
        spread: 95,
        origin: { y: 0.5 },
        colors: ["#E9A62B", "#A8232F", "#F4D03F", "#E75480", "#2F5D3A", "#FAF5EE", "#FFE8A3"],
        shapes: ["circle"],
        scalar: 1.3,
        ticks: 240,
      });
    } catch {
      // Ignore if confetti not supported
    }

    setIsVisible(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  const runSequence = useCallback(() => {
    setIsVisible(true);
    setStage(0);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    // Plate 1 (Puberty): 0.0s - 2.2s
    // Plate 2 (Baby Shower): 2.2s - 4.4s
    const t1 = setTimeout(() => {
      setStage(1);
    }, 2200);

    // Plate 3 (Wedding): 4.4s - 6.6s
    const t2 = setTimeout(() => {
      setStage(2);
    }, 4400);

    // BRB Decors Brand Reveal: 6.6s - 9.8s (STAYS FOR 3.2 SECONDS)
    const t3 = setTimeout(() => {
      setStage(3);
    }, 6600);

    // Transition to Home Page after BRB Decors has stayed for 3.2 seconds (total 9.8s)
    const t4 = setTimeout(() => {
      handleComplete();
    }, 9800);

    timerRef.current = [t1, t2, t3, t4];
  }, [handleComplete]);

  // Trigger on first visit to home page only (not on /admin or subsequent navigations)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin") || path.startsWith("/login")) {
        return;
      }
      const alreadySeen = sessionStorage.getItem("brb_seen_splash");
      if (!alreadySeen && (path === "/" || path === "")) {
        sessionStorage.setItem("brb_seen_splash", "true");
        runSequence();
      }
    }

    // Skip on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Replay event listener
    const handleReplayEvent = () => {
      runSequence();
    };
    window.addEventListener("replay-ceremonial-splash", handleReplayEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("replay-ceremonial-splash", handleReplayEvent);
      timerRef.current.forEach(clearTimeout);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [handleComplete, runSequence]);

  if (!isVisible) return null;

  const currentPlate = stage < 3 ? CEREMONIAL_STAGES[stage] : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ceremonial-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-between overflow-hidden text-[#FAF5EE] select-none"
          style={{
            background: "radial-gradient(ellipse at center, #260B1D 0%, #150616 55%, #0A020B 100%)",
          }}
          role="dialog"
          aria-label="Welcome to BRB Decors"
        >
          {/* 1. TRADITIONAL MANGO LEAF & MARIGOLD THORANAM (மாவிலை & மலர் தோரணம்) ACROSS TOP */}
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden">
            {/* Top Garland Ribbon Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#8B5E14] via-[#FFE8A3] to-[#8B5E14] shadow-md" />

            {/* Repeating Scalloped Thoranam with Mango Leaves, Jasmine and Marigolds */}
            <svg
              viewBox="0 0 1440 110"
              className="w-full h-16 sm:h-20 text-[#2F5D3A] preserve-3d"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Mango Leaf Gradient */}
                <linearGradient id="mangoLeafGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#417D50" />
                  <stop offset="60%" stopColor="#2F5D3A" />
                  <stop offset="100%" stopColor="#1E3E26" />
                </linearGradient>

                {/* Marigold Flower Gradient */}
                <radialGradient id="marigoldGrad">
                  <stop offset="0%" stopColor="#FFF2A3" />
                  <stop offset="45%" stopColor="#F4D03F" />
                  <stop offset="85%" stopColor="#E9A62B" />
                  <stop offset="100%" stopColor="#A84C0F" />
                </radialGradient>

                {/* Golden Bell Gradient */}
                <linearGradient id="brassBellGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFE8A3" />
                  <stop offset="50%" stopColor="#D49E34" />
                  <stop offset="100%" stopColor="#87570E" />
                </linearGradient>

                {/* Single Mango Leaf Path */}
                <g id="leafUnit">
                  <path
                    d="M 0 0 C -12 25 -16 55 0 85 C 16 55 12 25 0 0 Z"
                    fill="url(#mangoLeafGrad)"
                    stroke="#8FE39E"
                    strokeWidth="0.7"
                    opacity="0.95"
                  />
                  {/* Central Leaf Vein */}
                  <line x1="0" y1="2" x2="0" y2="80" stroke="#8FE39E" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* Flower cluster */}
                <g id="flowerUnit">
                  <circle cx="0" cy="0" r="7" fill="url(#marigoldGrad)" />
                  <circle cx="0" cy="0" r="3" fill="#A8232F" />
                  {/* Jasmine droplet */}
                  <circle cx="0" cy="11" r="3" fill="#FAF5EE" />
                  <circle cx="0" cy="18" r="2.2" fill="#FAF5EE" />
                </g>
              </defs>

              {/* Garland Swag Catenary Curves */}
              {[...Array(9)].map((_, i) => {
                const step = 160;
                const startX = i * step;
                const midX = startX + step / 2;
                const endX = startX + step;
                return (
                  <g key={`swag-${i}`}>
                    {/* Hanging Jasmine Swag */}
                    <path
                      d={`M ${startX} 0 Q ${midX} 55 ${endX} 0`}
                      fill="none"
                      stroke="#FFE8A3"
                      strokeWidth="2.5"
                      strokeDasharray="4 6"
                      opacity="0.75"
                    />
                    {/* Marigold Beads on the Swag */}
                    <circle cx={startX + 40} cy="26" r="4.5" fill="url(#marigoldGrad)" />
                    <circle cx={midX} cy="38" r="5.5" fill="url(#marigoldGrad)" />
                    <circle cx={startX + 120} cy="26" r="4.5" fill="url(#marigoldGrad)" />
                  </g>
                );
              })}

              {/* Hanging Mango Leaves (மாவிலை தோரணம்) at Regular Intervals */}
              {[...Array(18)].map((_, i) => {
                const x = i * 80 + 40;
                return (
                  <g key={`leaf-${i}`} transform={`translate(${x}, 0)`}>
                    <use href="#leafUnit" />
                    <use href="#flowerUnit" transform="translate(0, 10)" />
                  </g>
                );
              })}

              {/* Corner Hanging Brass Temple Bells */}
              <g transform="translate(45, 0)">
                <line x1="0" y1="0" x2="0" y2="45" stroke="#FFE8A3" strokeWidth="2" />
                <path d="M -9 45 L 9 45 L 14 65 L -14 65 Z" fill="url(#brassBellGrad)" />
                <circle cx="0" cy="67" r="3.5" fill="#FFE8A3" />
              </g>
              <g transform="translate(1395, 0)">
                <line x1="0" y1="0" x2="0" y2="45" stroke="#FFE8A3" strokeWidth="2" />
                <path d="M -9 45 L 9 45 L 14 65 L -14 65 Z" fill="url(#brassBellGrad)" />
                <circle cx="0" cy="67" r="3.5" fill="#FFE8A3" />
              </g>
            </svg>
          </div>

          {/* 2. AMBIENT GLOW & AUSPICIOUS KOLAM BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Center Candlelight Amber Aura */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[120px] opacity-35"
              style={{
                background: "radial-gradient(circle, #E9A62B 0%, #A8232F 45%, transparent 75%)",
              }}
            />

            {/* Sacred Kolam Dot Grid across the background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: "radial-gradient(#FFE8A3 1.2px, transparent 1.2px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Subtle Corner Kolam Motifs */}
            <div className="absolute bottom-6 left-6 w-32 h-32 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#FFE8A3] fill-none" strokeWidth="1">
                <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="25" />
                <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 22 22 L 78 78 M 22 78 L 78 22" />
              </svg>
            </div>
            <div className="absolute bottom-6 right-6 w-32 h-32 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#FFE8A3] fill-none" strokeWidth="1">
                <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="25" />
                <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 22 22 L 78 78 M 22 78 L 78 22" />
              </svg>
            </div>
          </div>

          {/* 3. FLOATING PETALS DRIFTING THROUGH THE THORANAM */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={`petal-drift-${i}`}
                initial={{
                  y: -30,
                  x: `${(i * 7.5 + 4) % 96}vw`,
                  rotate: (i * 25) % 360,
                  opacity: 0,
                }}
                animate={{
                  y: "105vh",
                  x: `${((i * 7.5 + 4) % 96) + (i % 2 === 0 ? 8 : -8)}vw`,
                  rotate: (i * 25 + 360) % 360,
                  opacity: [0, 0.8, 0.85, 0],
                }}
                transition={{
                  duration: 5.2 + (i % 3) * 0.9,
                  repeat: Infinity,
                  delay: (i * 0.28) % 3,
                  ease: "easeInOut",
                }}
                className="absolute text-sm select-none"
              >
                {i % 3 === 0 ? "🌼" : i % 3 === 1 ? "🌸" : "🌹"}
              </motion.div>
            ))}
          </div>

          {/* 4. TOP BAR: BRAND MONOGRAM & SKIP BUTTON (Positioned cleanly below Thoranam) */}
          <header className="relative z-40 w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-22 px-6 flex items-center justify-between">
            {/* Brand Monogram */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-[#FFE8A3]"
                style={{
                  background: "linear-gradient(135deg, #FFE8A3 0%, #D49E34 50%, #87570E 100%)",
                }}
              >
                <span className="text-[#150617] font-bold text-xs">✦</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#FAF5EE] uppercase">
                  BRB Decors
                </span>
                <span className="text-[9px] text-[#FFE8A3] tracking-widest font-sans uppercase">
                  சென்னை • Ceremonial Plating
                </span>
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#FFE8A3]/40 bg-[#28122A]/85 hover:bg-[#3D1A3F] backdrop-blur-md text-xs font-semibold text-[#FAF5EE]/90 hover:text-[#FAF5EE] hover:border-[#FFE8A3] transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              title="Skip Intro (Esc)"
              aria-label="Skip Intro"
            >
              <span className="text-[#FFE8A3]">தவிர் / Skip</span>
              <X className="w-3.5 h-3.5 text-[#FFE8A3]" />
            </button>
          </header>

          {/* 5. CENTER: THE THAALAM SHOWCASE & ONLY ONE TEXT SECTION BELOW (No text on top) */}
          <main className="relative z-30 flex flex-col items-center justify-center my-auto px-4 max-w-2xl w-full">
            {/* THE GRAND CONCENTRIC BRASS THAALAM FRAME */}
            <div className="relative w-68 h-68 sm:w-80 sm:h-80 md:w-92 md:h-92 flex items-center justify-center">
              {/* Outer Golden Concentric Beaded Rims with Specular Highlight */}
              <div
                className="absolute inset-0 rounded-full p-2.5 sm:p-3.5 shadow-[0_25px_65px_rgba(0,0,0,0.9),0_0_55px_rgba(233,166,43,0.4)] border-2 border-[#FFE8A3]"
                style={{
                  background:
                    "conic-gradient(from 45deg, #FFE8A3, #E9A62B, #9B6F1C, #FFE8A3, #D49E34, #87570E, #FFE8A3)",
                }}
              >
                {/* Secondary Inset Brass Rim Ring */}
                <div
                  className="relative w-full h-full rounded-full p-2 border-2 border-[#FFE8A3]/85 shadow-inner flex items-center justify-center overflow-hidden"
                  style={{
                    background: "radial-gradient(circle, #381424 0%, #1A0714 70%, #0D030B 100%)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {/* STAGES 0, 1, 2: The 3 User-Specified Plates (Puberty, Baby Shower, Wedding) */}
                    {stage < 3 && currentPlate && (
                      <motion.div
                        key={`plate-${stage}`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                        className="relative w-full h-full rounded-full overflow-hidden"
                      >
                        <Image
                          src={currentPlate.url}
                          alt={currentPlate.alt}
                          fill
                          priority
                          unoptimized
                          sizes="(max-width: 640px) 272px, (max-width: 768px) 320px, 368px"
                          className="object-cover"
                        />
                        {/* Soft subtle vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
                      </motion.div>
                    )}

                    {/* STAGE 3: Brand Name "BRB Decors" (STAYS FOR AT LEAST 3 SECONDS) */}
                    {stage === 3 && (
                      <motion.div
                        key="brand-name"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-full rounded-full flex flex-col items-center justify-center text-center px-6"
                        style={{
                          background:
                            "radial-gradient(circle, #44172E 0%, #1F0819 75%, #0B020B 100%)",
                        }}
                      >
                        {/* Auspicious Golden Emblem */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className="w-14 h-14 rounded-full mb-3 flex items-center justify-center shadow-xl border-2 border-[#FFE8A3]"
                          style={{
                            background:
                              "linear-gradient(135deg, #FFE8A3 0%, #D49E34 50%, #87570E 100%)",
                          }}
                        >
                          <span className="text-[#150617] font-bold text-xl">✦</span>
                        </motion.div>

                        {/* Grand Brand Name: BRB Decors */}
                        <motion.h1
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.5 }}
                          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF5EE] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                        >
                          BRB Decors
                        </motion.h1>

                        {/* Tagline */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25, duration: 0.4 }}
                          className="font-serif text-xs sm:text-sm text-[#FFE8A3] italic tracking-wide mt-1.5"
                        >
                          “BRB, we’re arranging something beautiful”
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                          className="mt-3 flex items-center gap-1.5 text-[10px] text-[#FAF5EE]/80 font-sans tracking-widest uppercase bg-[#FAF5EE]/10 px-3 py-1 rounded-full border border-[#FFE8A3]/30"
                        >
                          <span>சென்னை • Handcrafted Ceremonial Plating</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* BILINGUAL FUNCTION NAME & CATCHY SUBTITLE (Below the Plate) */}
            <div className="h-20 sm:h-24 mt-4 sm:mt-5 flex flex-col items-center justify-center text-center max-w-lg px-4">
              <AnimatePresence mode="wait">
                {currentPlate ? (
                  <motion.div
                    key={`text-${stage}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center space-y-1"
                  >
                    {/* Big Auspicious Tamil Function Name */}
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#FFE8A3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {currentPlate.tamilName}
                    </h2>

                    {/* Clear English Function Name */}
                    <p className="font-serif text-sm sm:text-base font-semibold text-[#FAF5EE] tracking-normal">
                      {currentPlate.englishName}
                    </p>

                    {/* Artisanal Detail Subtext */}
                    <p className="text-[10px] sm:text-xs text-[#FAF5EE]/75 font-sans leading-tight">
                      {currentPlate.subtitleTamil} • {currentPlate.subtitleEn}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="text-final"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFE8A3]">
                      மங்கலத் தட்டுகள் & மேடை அலங்காரம்
                    </h2>
                    <p className="font-serif text-xs sm:text-sm text-[#FAF5EE]/90 italic">
                      Traditional Decorative Thaalams, Seer Varisai & Stage Artistry
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* 6. BOTTOM BAR: PROGRESS INDICATORS */}
          <footer className="relative z-30 w-full max-w-xs mx-auto pb-5 sm:pb-6 pt-1 px-4 flex flex-col items-center">
            {/* Step Progress Indicators */}
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3].map((s) => (
                <div
                  key={`step-dot-${s}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    stage === s
                      ? "w-8 bg-gradient-to-r from-[#E9A62B] to-[#FFE8A3] shadow-[0_0_12px_#E9A62B]"
                      : stage > s
                      ? "w-2.5 bg-[#E9A62B]/60"
                      : "w-2 bg-[#FAF5EE]/20"
                  }`}
                />
              ))}
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
