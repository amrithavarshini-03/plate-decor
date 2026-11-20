"use client";

import React from "react";

interface PlateFrameProps {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  material?: "brass" | "silver" | "ceramic";
  className?: string;
  withLeafBed?: boolean;
}

export function PlateFrame({
  children,
  size = "md",
  material = "brass",
  className = "",
  withLeafBed = false,
}: PlateFrameProps) {
  const sizeClasses = {
    sm: "w-28 h-28 md:w-36 md:h-36",
    md: "w-48 h-48 md:w-64 md:h-64",
    lg: "w-72 h-72 md:w-96 md:h-96",
    xl: "w-80 h-80 md:w-[460px] md:h-[460px]",
    full: "w-full aspect-square",
  }[size];

  const rimStyles = {
    brass: {
      outerRim: "border-[6px] border-[#E4C580] shadow-[0_16px_40px_rgba(184,142,63,0.22),_0_4px_16px_rgba(43,26,46,0.06)]",
      innerBead: "border-[#C8A86B]",
      baseBg: "bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E7] to-[#F3E6CE]",
    },
    silver: {
      outerRim: "border-[6px] border-[#D6DCE5] shadow-[0_16px_40px_rgba(160,174,192,0.25)]",
      innerBead: "border-[#A0AEC0]",
      baseBg: "bg-gradient-to-br from-[#FFFFFF] via-[#F4F6F9] to-[#E2E8F0]",
    },
    ceramic: {
      outerRim: "border-4 border-[#E8DAC8] shadow-[0_12px_32px_rgba(43,26,46,0.08)]",
      innerBead: "border-[#DFD2BF]",
      baseBg: "bg-[#FFFDF9]",
    },
  }[material];

  return (
    <div
      className={`relative rounded-full flex items-center justify-center p-3 select-none transition-all duration-500 ${sizeClasses} ${rimStyles.outerRim} ${rimStyles.baseBg} ${className}`}
    >
      {/* Decorative Beaded Inner Rim (traditional thaalam bead embossing) */}
      <div
        className={`absolute inset-2 rounded-full border border-dashed ${rimStyles.innerBead} opacity-60 pointer-events-none`}
      />

      {/* Fresh Plantain Leaf bed underlayer if enabled */}
      {withLeafBed && (
        <div className="absolute inset-4 rounded-full overflow-hidden bg-[#2F5D3A] opacity-90 shadow-inner flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-35 stroke-[#427E51]">
            <line x1="50" y1="0" x2="50" y2="100" strokeWidth="2" />
            <line x1="50" y1="20" x2="10" y2="35" strokeWidth="1" />
            <line x1="50" y1="20" x2="90" y2="35" strokeWidth="1" />
            <line x1="50" y1="40" x2="10" y2="55" strokeWidth="1" />
            <line x1="50" y1="40" x2="90" y2="55" strokeWidth="1" />
            <line x1="50" y1="60" x2="10" y2="75" strokeWidth="1" />
            <line x1="50" y1="60" x2="90" y2="75" strokeWidth="1" />
            <line x1="50" y1="80" x2="15" y2="95" strokeWidth="1" />
            <line x1="50" y1="80" x2="85" y2="95" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* Plate content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center rounded-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
