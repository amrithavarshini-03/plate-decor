"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface IntroArrangementProps {
  onComplete: () => void;
}

export function IntroArrangement({ onComplete }: IntroArrangementProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0); // 0: Plate, 1: Leaves, 2: Petals, 3: Fruits, 4: Glide, 5: Done
  const [petalCount, setPetalCount] = useState(1);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Check if seen in this browser session
    const seen = sessionStorage.getItem("brb_intro_seen");
    if (seen === "true") {
      onComplete();
      return;
    }

    // Step 1: Rim draws (0 - 800ms)
    const t1 = setTimeout(() => {
      setStep(1); // Leaves fan out
      setPetalCount(2);
    }, 700);

    // Step 2: Petals bloom (1500ms)
    const t2 = setTimeout(() => {
      setStep(2);
      setPetalCount(5);
    }, 1500);

    // Step 3: Fruits drop (2300ms)
    const t3 = setTimeout(() => {
      setStep(3);
      setPetalCount(8);
    }, 2300);

    // Step 4: Shrink and glide toward logo (3400ms)
    const t4 = setTimeout(() => {
      setStep(4);
    }, 3400);

    // Step 5: Finished (4200ms)
    const t5 = setTimeout(() => {
      sessionStorage.setItem("brb_intro_seen", "true");
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsSkipped(true);
    sessionStorage.setItem("brb_intro_seen", "true");
    setTimeout(onComplete, 200);
  };

  if (isSkipped) return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[999] bg-[#FBF6EC] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Top bar with minimal Petal Counter & Skip */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-medium text-[#635166]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E9A62B] animate-pulse" />
            <span>{t.intro.petalCounter(petalCount, 8)}</span>
          </div>

          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-[#2B1A2E] hover:border-[#2F5D3A] hover:text-[#2F5D3A] transition-colors duration-200"
          >
            {t.intro.skip} ➔
          </button>
        </div>

        {/* Central Arranging Thaalam Canvas */}
        <motion.div
          animate={
            step === 4
              ? {
                  x: "-42vw",
                  y: "-42vh",
                  scale: 0.15,
                  opacity: 0,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                }
              : { scale: 1, x: 0, y: 0, opacity: 1 }
          }
          className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            {/* 1. Golden Plate Rim Drawing */}
            <motion.circle
              cx="200"
              cy="200"
              r="170"
              fill="#FFFDF9"
              stroke="#E4C580"
              strokeWidth="5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Beaded rim accent */}
            <motion.circle
              cx="200"
              cy="200"
              r="158"
              fill="none"
              stroke="#C8A86B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={step >= 0 ? { opacity: 0.8 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* 2. Banana Leaves Fanning Out in a Radial Ring (8 leaves) */}
            {step >= 1 && (
              <g id="banana-leaves">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <motion.g
                    key={deg}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    transform={`rotate(${deg} 200 200)`}
                  >
                    {/* Plantain leaf petal shape */}
                    <path
                      d="M200 70 C 180 110, 185 160, 200 180 C 215 160, 220 110, 200 70 Z"
                      fill="#2F5D3A"
                      stroke="#214229"
                      strokeWidth="1"
                    />
                    {/* Leaf midrib */}
                    <line x1="200" y1="75" x2="200" y2="175" stroke="#427E51" strokeWidth="1" />
                  </motion.g>
                ))}
              </g>
            )}

            {/* 3. Marigold & Rose Petals Blooming inward */}
            {step >= 2 && (
              <g id="petals">
                {/* Outer Marigold Ring */}
                {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                  <motion.circle
                    key={`marigold-${deg}`}
                    cx={200 + 95 * Math.cos((deg * Math.PI) / 180)}
                    cy={200 + 95 * Math.sin((deg * Math.PI) / 180)}
                    r="16"
                    fill="#E9A62B"
                    stroke="#D48A18"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}

                {/* Inner Crimson Rose Blossom Ring */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <motion.circle
                    key={`rose-${deg}`}
                    cx={200 + 55 * Math.cos((deg * Math.PI) / 180)}
                    cy={200 + 55 * Math.sin((deg * Math.PI) / 180)}
                    r="14"
                    fill="#A8232F"
                    stroke="#8A1B25"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </g>
            )}

            {/* 4. Auspicious Ceremonial Fruits Dropping into Center with Soft Bounce */}
            {step >= 3 && (
              <g id="fruits">
                {/* Center Pomegranate / Coconut */}
                <motion.g
                  initial={{ y: -60, scale: 0.3, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 220,
                  }}
                >
                  <circle cx="200" cy="200" r="24" fill="#C53030" stroke="#9B2C2C" strokeWidth="1.5" />
                  {/* Calyx crown */}
                  <polygon points="196,176 200,170 204,176 208,172 200,180 192,172" fill="#9B2C2C" />
                  {/* Kumkum auspicious dot */}
                  <circle cx="200" cy="200" r="5" fill="#FFFDF9" opacity="0.9" />
                </motion.g>

                {/* Left Golden Mango */}
                <motion.path
                  d="M165 190 C 150 180, 145 210, 160 225 C 175 235, 185 215, 175 195 Z"
                  fill="#F6AD55"
                  stroke="#DD6B20"
                  strokeWidth="1.5"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 14,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                />

                {/* Right Sweet Lemon */}
                <motion.circle
                  cx="235"
                  cy="208"
                  r="13"
                  fill="#ECC94B"
                  stroke="#D69E2E"
                  strokeWidth="1.5"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 14,
                    stiffness: 200,
                    delay: 0.15,
                  }}
                />
              </g>
            )}
          </svg>
        </motion.div>

        {/* Delicate loading text caption */}
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-sm font-serif italic text-[#635166] tracking-wide"
        >
          {t.intro.arranging}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
