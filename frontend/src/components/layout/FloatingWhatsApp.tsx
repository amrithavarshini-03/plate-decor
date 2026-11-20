"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";

export function FloatingWhatsApp() {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-[#2B1A2E] text-xs font-medium shadow-[0_8px_20px_rgba(43,26,46,0.12)] animate-in fade-in slide-in-from-right-3 duration-200">
          <span>{t.whatsappButton.directChat}</span>
          <span className="w-2 h-2 bg-[#2F5D3A] rounded-full ml-2 animate-pulse" />
        </div>
      )}

      {/* Floating button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Consultation"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2F5D3A] text-[#FBF6EC] flex items-center justify-center shadow-[0_8px_25px_rgba(47,93,58,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(47,93,58,0.55)] border-2 border-[#E4C580]"
      >
        {/* Pulsing auspicious aura */}
        <span className="absolute inset-0 rounded-full bg-[#2F5D3A] opacity-40 animate-ping pointer-events-none" />

        {/* Small gold marigold accent pin */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E9A62B] border-2 border-[#FFFDF9] flex items-center justify-center text-[10px] shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A8232F]" />
        </span>

        {/* WhatsApp / Chat Icon */}
        <MessageCircle className="w-7 h-7 text-[#FBF6EC] transition-transform duration-300 group-hover:rotate-12" />
      </a>
    </div>
  );
}
