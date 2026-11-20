"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#214229] text-[#FBF6EC] pt-16 pb-12 overflow-hidden">
      {/* Decorative Top Toran Row: Small plates swaying gently */}
      <div className="absolute top-0 left-0 right-0 flex justify-around -translate-y-1/2 pointer-events-none opacity-85 overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#FAF3E7] border-2 border-[#E4C580] shadow-md flex items-center justify-center animate-thoranam-sway"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-dashed border-[#C8A86B] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9A62B]" />
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2F5D3A]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border-2 border-[#E4C580] flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-[#E9A62B]" />
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight text-[#FAF3E7]">
                {SITE_CONFIG.businessName}
              </span>
            </div>
            <p className="font-serif text-lg italic text-[#E8DAC8] max-w-md">
              &ldquo;{SITE_CONFIG.tagline}&rdquo;
            </p>
            <p className="text-sm text-[#FBF6EC]/70 max-w-sm leading-relaxed">
              {t.footer.madeWith}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#E9A62B]">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-[#FBF6EC]/80">
              <li>
                <Link href="/gallery?occasion=puberty" className="hover:text-[#E9A62B] transition-colors">
                  Puberty Ceremony (Manjal Neerattu)
                </Link>
              </li>
              <li>
                <Link href="/gallery?occasion=wedding" className="hover:text-[#E9A62B] transition-colors">
                  Wedding Seer Varisai
                </Link>
              </li>
              <li>
                <Link href="/gallery?occasion=baby_shower" className="hover:text-[#E9A62B] transition-colors">
                  Valaikappu & Seemantham
                </Link>
              </li>
              <li>
                <Link href="/gallery?occasion=housewarming" className="hover:text-[#E9A62B] transition-colors">
                  Housewarming & Pooja
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Consultation / Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#E9A62B]">
              Studio & Contact
            </h4>
            <p className="text-sm text-[#FBF6EC]/80">
              {SITE_CONFIG.address}
            </p>
            <p className="text-sm text-[#E9A62B] font-medium">
              WhatsApp: {SITE_CONFIG.phone}
            </p>
            <p className="text-xs text-[#FBF6EC]/60">
              {SITE_CONFIG.hours}
            </p>
          </div>
        </div>

        {/* Bottom Bar with Footer Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF6EC]/60 gap-4">
          <p className="font-serif italic text-sm text-[#FAF3E7]">
            {t.footer.tagline}
          </p>
          <p>
            © 2025 {SITE_CONFIG.businessName}. {t.footer.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
