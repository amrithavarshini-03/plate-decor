"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Bookmark, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_GALLERY } from "@/data/mockData";
import { PetalButton } from "@/components/primitives/PetalButton";

export function SignatureShowcase() {
  const { language, t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<{
    title: string;
    productName: string;
    priceNote: string;
  } | null>(null);

  const featured = MOCK_GALLERY.slice(0, 3);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>{t.signatureSection.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          {t.signatureSection.title}
        </h2>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.signatureSection.subtitle}
        </p>
      </div>

      {/* 1. Signature Interactive Before/After Slider */}
      <div className="mb-20 bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E8DAC8] shadow-[0_16px_40px_rgba(43,26,46,0.06)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E9A62B]">
              {t.signatureSection.beforeAfterBadge}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E]">
              From Bare Tray to Sacred Mandala
            </h3>
          </div>
          <p className="text-xs text-[#635166] max-w-sm">
            Drag the slider to witness how hours of careful leaf-pleating, floral arrangement, and carving transform raw brass into an auspicious centerpiece.
          </p>
        </div>

        {/* Visual Slider Container */}
        <div className="relative w-full max-w-2xl mx-auto aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#E4C580] shadow-xl select-none">
          {/* After Image (Full background) */}
          <div className="absolute inset-0">
            <Image
              src="/images/decor/pistachio_almond_floral_bouquet.jpg"
              alt="Finished Handcrafted Thaalam"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-4 right-4 bg-[#2F5D3A]/90 text-[#FBF6EC] px-3 py-1 rounded-full text-xs font-semibold">
              {t.signatureSection.afterLabel}
            </span>
          </div>

          {/* Before Image (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="relative w-full h-full min-w-[320px] sm:min-w-[672px]">
              <Image
                src="/images/placeholders/tray_raw.jpg"
                alt="Raw Brass Tray"
                fill
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-4 left-4 bg-[#2B1A2E]/80 text-[#FFFDF9] px-3 py-1 rounded-full text-xs font-semibold">
              {t.signatureSection.beforeLabel}
            </span>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#E4C580] shadow-[0_0_12px_rgba(233,166,43,0.8)] cursor-ew-resize flex items-center justify-center -translate-x-1/2"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Center Floral Handle */}
            <div className="w-9 h-9 rounded-full bg-[#E9A62B] border-2 border-[#FFFDF9] shadow-lg flex items-center justify-center text-xs text-white">
              <span className="text-[10px] font-bold">◄ ►</span>
            </div>
          </div>

          {/* Native Slider Input Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            aria-label="Before and After Decoration Slider"
          />
        </div>
      </div>

      {/* 2. Featured Portfolio Grid with Petal Masks & Hotspot Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featured.map((item) => {
          const isSaved = savedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] overflow-hidden shadow-[0_12px_32px_rgba(43,26,46,0.05)] hover:shadow-[0_20px_48px_rgba(43,26,46,0.12)] transition-all duration-400"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-[#FAF5EE] overflow-hidden p-6 flex items-center justify-center">
                {/* Plate Frame Circular Mask */}
                <div className="relative w-full h-full rounded-full border-4 border-[#E4C580] overflow-hidden shadow-inner transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Hotspot Dots */}
                {item.hotspots?.map((spot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHotspot(spot)}
                    className="absolute z-20 w-6 h-6 rounded-full bg-[#E9A62B] border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-125 focus:outline-none"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    title={spot.title}
                    aria-label={`Hotspot: ${spot.title}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#A8232F] animate-ping" />
                  </button>
                ))}

                {/* Save to board pin */}
                <button
                  onClick={(e) => toggleSave(item.id, e)}
                  className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-[#E8DAC8] flex items-center justify-center shadow-sm transition-colors ${
                    isSaved ? "bg-[#A8232F] text-white" : "bg-[#FFFDF9] text-[#2B1A2E] hover:text-[#A8232F]"
                  }`}
                  title={t.signatureSection.pinToBoard}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">
                    {language === "ta" ? item.titleTamil : item.title}
                  </h3>
                  <p className="text-xs text-[#635166] mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-[#F4EDE0] flex items-center justify-between">
                  <Link
                    href={`/plan?template=${item.id}&occasion=${item.occasion}`}
                    className="text-xs font-semibold text-[#2F5D3A] hover:text-[#214229] flex items-center gap-1.5 transition-colors"
                  >
                    <span>{t.signatureSection.planOneLikeThis}</span>
                    <span>➔</span>
                  </Link>

                  {item.hotspots && item.hotspots.length > 0 && (
                    <span className="text-[11px] text-[#E9A62B] font-medium flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{item.hotspots.length} DIY tools</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hotspot Drawer Modal */}
      {activeHotspot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] max-w-sm w-full rounded-3xl p-6 border-2 border-[#E4C580] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E9A62B]">
                Shop the Look
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-[#635166] hover:text-[#2B1A2E] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-serif text-lg font-bold text-[#2B1A2E]">
                {activeHotspot.title}
              </h4>
              <p className="text-xs text-[#635166] mt-1">
                Used in this arrangement: <span className="font-medium text-[#2B1A2E]">{activeHotspot.productName}</span>
              </p>
              <p className="text-xs font-semibold text-[#2F5D3A] mt-2">
                {activeHotspot.priceNote}
              </p>
            </div>

            <div className="pt-2">
              <PetalButton
                href="/shop"
                size="sm"
                variant="primary"
                className="w-full"
                onClick={() => setActiveHotspot(null)}
              >
                View in DIY Sourcing Directory
              </PetalButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
