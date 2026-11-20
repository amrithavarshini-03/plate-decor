"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterPlateSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterPlateSlider({
  beforeImage = "/images/placeholders/tray_raw.jpg",
  afterImage = "/images/decor/vetrilai_mandala_lemon.jpg",
  beforeLabel = "Raw Brass Vessel",
  afterLabel = "Finished Ceremonial Thaalam",
  className = "",
}: BeforeAfterPlateSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div className={`space-y-4 text-center ${className}`}>
      {/* Ceremonial Showcase Frame Container - Clean, Uncropped Rectangular Arch */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        className="relative aspect-[16/10] sm:aspect-[16/9] max-w-3xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D4A348]/60 shadow-2xl select-none cursor-ew-resize p-1.5 sm:p-2.5 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(212,163,72,0.22)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(228, 197, 128, 0.3) 0%, rgba(255, 253, 249, 0.8) 50%, rgba(212, 163, 72, 0.35) 100%)",
        }}
      >
        {/* Four Corner Flourishes */}
        <span className="absolute top-2 left-3 text-xs sm:text-sm select-none pointer-events-none z-30 text-[#B88E3F] font-serif">
          ✦
        </span>
        <span className="absolute top-2 right-3 text-xs sm:text-sm select-none pointer-events-none z-30 text-[#B88E3F] font-serif">
          ✦
        </span>
        <span className="absolute bottom-2 left-3 text-xs sm:text-sm select-none pointer-events-none z-30 text-[#B88E3F] font-serif">
          ✦
        </span>
        <span className="absolute bottom-2 right-3 text-xs sm:text-sm select-none pointer-events-none z-30 text-[#B88E3F] font-serif">
          ✦
        </span>

        {/* Inner Canvas containing the slider images */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4A348]/40 bg-[#FAF5EE]">
          {/* Ambient Glow */}
          <div className="absolute inset-0 opacity-20 blur-2xl scale-110 pointer-events-none bg-[#D4A348]" />

          {/* After Image (Background: Arranged Plate) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={afterImage}
              alt={afterLabel}
              fill
              unoptimized
              className="object-contain p-2.5 sm:p-4 drop-shadow-md"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Before Image (Clipped Overlay: Empty Tray) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden transition-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={beforeImage}
              alt={beforeLabel}
              fill
              unoptimized
              className="object-contain p-2.5 sm:p-4 drop-shadow-md"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Golden Divider Line with Ceremonial Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#E4C580] via-[#D4A348] to-[#9B782B] shadow-[0_0_12px_rgba(212,163,72,0.9)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFFDF9] border-2 border-[#D4A348] shadow-xl flex items-center justify-center text-[#2F5D3A] transition-transform hover:scale-110">
              <MoveHorizontal className="w-4 h-4 text-[#B88E3F]" />
            </div>
          </div>

          {/* Labels Overlay */}
          <div
            className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 px-3 py-1.5 rounded-full bg-[#2B1A2E]/85 text-white text-[10px] sm:text-[11px] font-serif font-semibold tracking-wider backdrop-blur-md pointer-events-none border border-white/20 transition-opacity shadow-sm"
            style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
          >
            <span className="text-[#E4C580] mr-1.5">✦</span>
            {beforeLabel}
          </div>

          <div
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-3 py-1.5 rounded-full bg-[#2F5D3A]/90 text-white text-[10px] sm:text-[11px] font-serif font-semibold tracking-wider backdrop-blur-md pointer-events-none border border-white/20 transition-opacity shadow-sm"
            style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
          >
            <span className="text-[#E9A62B] mr-1.5">✦</span>
            {afterLabel}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#635166] flex items-center justify-center gap-2">
        <MoveHorizontal className="w-3.5 h-3.5 text-[#B88E3F]" />
        <span>Drag the golden slider to inspect how raw ceremonial vessels transform into finished works of art</span>
      </p>
    </div>
  );
}
