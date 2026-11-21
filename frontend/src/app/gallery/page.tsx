"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Filter,
  Bookmark,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_GALLERY, GalleryItem } from "@/data/mockData";
import { PetalButton } from "@/components/primitives/PetalButton";

export default function GalleryPage() {
  const { language, t } = useLanguage();

  // Filters state
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedPlateType, setSelectedPlateType] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Lightbox & Saved state
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load saved plates from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("brb_saved_plates");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not retrieve saved plates from localStorage", e);
    }
  }, []);

  // Save/Unsave handler with persistent storage
  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("brb_saved_plates", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
      return updated;
    });
  };

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return MOCK_GALLERY.filter((item) => {
      if (showSavedOnly && !savedIds.includes(item.id)) return false;
      if (selectedOccasion !== "all" && item.occasion !== selectedOccasion) return false;
      if (selectedPlateType !== "all" && item.plateType !== selectedPlateType) return false;
      if (selectedTheme !== "all" && item.colorTheme !== selectedTheme) return false;
      if (selectedBudget !== "all" && item.budget !== selectedBudget) return false;
      return true;
    });
  }, [showSavedOnly, savedIds, selectedOccasion, selectedPlateType, selectedTheme, selectedBudget]);

  const resetFilters = () => {
    setSelectedOccasion("all");
    setSelectedPlateType("all");
    setSelectedTheme("all");
    setSelectedBudget("all");
    setShowSavedOnly(false);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>Ceremonial Portfolio</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2B1A2E]">
          {t.galleryPage.title}
        </h1>
        <p className="text-base text-[#635166] leading-relaxed">
          {t.galleryPage.subtitle}
        </p>
      </div>

      {/* Filter & Saved Control Bar */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E8DAC8] shadow-sm mb-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F4EDE0] pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
              <Filter className="w-4 h-4" />
              <span>Refine Arrangements</span>
            </div>

            {/* Prominent "Saved" Button */}
            <button
              type="button"
              onClick={() => setShowSavedOnly((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all shadow-xs ${
                showSavedOnly
                  ? "bg-[#A8232F] text-white border border-[#A8232F] shadow-sm scale-105"
                  : "bg-[#FFFDF9] text-[#2B1A2E] border border-[#E8DAC8] hover:border-[#A8232F] hover:text-[#A8232F]"
              }`}
              id="saved-filter-toggle"
              aria-pressed={showSavedOnly}
              title="Show only your saved arrangements"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-white text-white" : "text-[#A8232F]"}`} />
              <span>{language === "ta" ? "சேமிக்கப்பட்டவை" : "Saved"}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  showSavedOnly ? "bg-white/20 text-white" : "bg-[#FAF3E7] text-[#A8232F]"
                }`}
              >
                {savedIds.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {showSavedOnly && (
              <span className="text-xs text-[#A8232F] font-semibold flex items-center gap-1">
                <span>✦ Showing Saved Plates</span>
                <button
                  onClick={() => setShowSavedOnly(false)}
                  className="underline ml-1 hover:text-[#7D1B24]"
                >
                  (View All)
                </button>
              </span>
            )}

            {(selectedOccasion !== "all" ||
              selectedPlateType !== "all" ||
              selectedTheme !== "all" ||
              selectedBudget !== "all" ||
              showSavedOnly) && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#A8232F] hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Occasion */}
          <div>
            <label className="block text-[11px] font-semibold text-[#635166] uppercase mb-1.5">
              Occasion
            </label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] px-3 py-2 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
            >
              <option value="all">All Occasions</option>
              <option value="puberty">Puberty Ceremony (Manjal Neerattu)</option>
              <option value="wedding">Wedding & Engagements</option>
              <option value="baby_shower">Valaikappu / Baby Shower</option>
              <option value="housewarming">Housewarming / Festivals</option>
            </select>
          </div>

          {/* Plate Type */}
          <div>
            <label className="block text-[11px] font-semibold text-[#635166] uppercase mb-1.5">
              Plate Style
            </label>
            <select
              value={selectedPlateType}
              onChange={(e) => setSelectedPlateType(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] px-3 py-2 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
            >
              <option value="all">All Styles</option>
              <option value="fruits">Fruit Mandalas</option>
              <option value="flowers">Fresh Flower Rings</option>
              <option value="sweets_dryfruits">Sweets & Dry Fruits</option>
              <option value="deity">Deity Figurine Plates</option>
              <option value="baby_theme">Baby Cradle & Cutouts</option>
              <option value="stage_backdrop">Stage Backdrops</option>
            </select>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-[11px] font-semibold text-[#635166] uppercase mb-1.5">
              Color Swatch
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] px-3 py-2 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
            >
              <option value="all">All Palette Themes</option>
              <option value="turmeric_gold">Turmeric & Marigold Gold</option>
              <option value="banana_green">Banana Leaf Green</option>
              <option value="kumkum_red">Kumkum Red & Crimson</option>
              <option value="lotus_pink">Lotus & Rose Blush</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-[11px] font-semibold text-[#635166] uppercase mb-1.5">
              Arrangement Tier
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] px-3 py-2 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
            >
              <option value="all">All Tiers</option>
              <option value="simple">Simple (Starting tier)</option>
              <option value="signature">Signature (Most Popular)</option>
              <option value="grand">Grand (Royal Varisai)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {filteredItems.length === 0 ? (
        showSavedOnly ? (
          // Saved Empty State
          <div className="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E7] border border-[#E8DAC8] mx-auto flex items-center justify-center text-[#A8232F]">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
              {language === "ta" ? "சேமிக்கப்பட்ட தட்டுகள் எதுவும் இல்லை" : "No Saved Arrangements Yet"}
            </h3>
            <p className="text-sm text-[#635166] max-w-md mx-auto">
              {language === "ta"
                ? "படங்களின் மேல் உள்ள 'Save' பொத்தானைக் கிளிக் செய்து உங்கள் விருப்பமான தட்டுகளை இங்கே சேமிக்கவும்."
                : "Click the 'Save' button at the top of any plate image in the gallery to curate your personalized ceremonial mood board."}
            </p>
            <button
              onClick={() => setShowSavedOnly(false)}
              className="px-6 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-serif font-bold hover:bg-[#254A2E] transition-colors"
            >
              {language === "ta" ? "அனைத்து தட்டுகளையும் காண்க" : "Browse All Arrangements"}
            </button>
          </div>
        ) : (
          // General Empty State
          <div className="text-center py-24 bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C8A86B] mx-auto flex items-center justify-center">
              <span className="w-6 h-6 rounded-full bg-[#FAF3E7]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
              {t.galleryPage.emptyState}
            </h3>
            <PetalButton onClick={resetFilters} size="sm" variant="secondary">
              Reset Filters
            </PetalButton>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isSaved = savedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Architectural Showcase Frame - Fits ALL aspect ratios without circular cropping */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#FAF5EE] to-[#F5ECE0] p-3 flex items-center justify-center overflow-hidden border-b border-[#E8DAC8]">
                  {/* Inner Fillet with Brass Borders and Soft Glow */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#D4A348]/40 bg-[#FAF5EE]/90 shadow-inner flex items-center justify-center transition-all duration-500 group-hover:border-[#D4A348]/80 group-hover:shadow-md">
                    {/* Corner Brass Motifs */}
                    <span className="absolute top-1.5 left-2 text-[10px] select-none pointer-events-none z-10 text-[#D4A348]/70 font-serif">
                      ✦
                    </span>
                    <span className="absolute top-1.5 right-2 text-[10px] select-none pointer-events-none z-10 text-[#D4A348]/70 font-serif">
                      ✦
                    </span>
                    <span className="absolute bottom-1.5 left-2 text-[10px] select-none pointer-events-none z-10 text-[#D4A348]/70 font-serif">
                      ✦
                    </span>
                    <span className="absolute bottom-1.5 right-2 text-[10px] select-none pointer-events-none z-10 text-[#D4A348]/70 font-serif">
                      ✦
                    </span>

                    {/* Ambient Aura from the Plate Image */}
                    <div className="absolute inset-0 opacity-15 blur-xl scale-125 pointer-events-none">
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Full Uncropped Photograph with Gentle Hover Elevation */}
                    <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain drop-shadow-[0_8px_20px_rgba(43,26,46,0.12)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Clear "Save" Option at the Top-Right of Every Image */}
                    <button
                      type="button"
                      onClick={(e) => toggleSave(item.id, e)}
                      className={`absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold transition-all shadow-md backdrop-blur-md ${
                        isSaved
                          ? "bg-[#A8232F] text-white border border-[#A8232F] shadow-[0_2px_10px_rgba(168,35,47,0.35)] scale-105"
                          : "bg-[#FFFDF9]/95 text-[#2B1A2E] border border-[#E8DAC8] hover:border-[#A8232F] hover:text-[#A8232F] hover:scale-105"
                      }`}
                      aria-label={isSaved ? "Saved" : "Save plate"}
                      title={isSaved ? "Saved in your list" : "Save this arrangement"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white text-white" : "text-[#A8232F]"}`} />
                      <span>{isSaved ? (language === "ta" ? "சேமிக்கப்பட்டது" : "Saved") : (language === "ta" ? "சேமிக்க" : "Save")}</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#635166]">
                    <span className="uppercase font-semibold tracking-wider text-[#2F5D3A]">
                      {item.occasion.replace("_", " ")}
                    </span>
                    <span className="capitalize px-2.5 py-0.5 rounded-full bg-[#FAF3E7] text-[10px] font-semibold text-[#B88E3F] border border-[#E8DAC8]">
                      {item.budget} Tier
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#2B1A2E] group-hover:text-[#2F5D3A] transition-colors leading-snug">
                    {language === "ta" ? item.titleTamil : item.title}
                  </h3>

                  <p className="text-xs text-[#635166] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-[#F4EDE0] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2F5D3A] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Inspect Details</span>
                      <span>➔</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-[#E4C580] shadow-2xl p-6 sm:p-10 relative space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FAF3E7] hover:bg-[#E8DAC8] text-[#2B1A2E] flex items-center justify-center transition-colors z-20"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Image Preview - Clean Unobstructed Architectural Frame */}
              <div className="md:col-span-7 relative aspect-[4/3] bg-gradient-to-br from-[#FAF5EE] to-[#F5ECE0] rounded-2xl p-3 sm:p-4 flex items-center justify-center border-2 border-[#D4A348]/40 shadow-inner">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#E8DAC8] bg-[#FAF5EE]/90 flex items-center justify-center">
                  {/* Ambient Glow */}
                  <div className="absolute inset-0 opacity-20 blur-2xl scale-125 pointer-events-none bg-[#D4A348]" />

                  <Image
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    fill
                    unoptimized
                    className="object-contain p-2 drop-shadow-md"
                  />
                </div>
              </div>

              {/* Details & Actions */}
              <div className="md:col-span-5 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
                    {activeItem.occasion.replace("_", " ")}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E] mt-1">
                    {language === "ta" ? activeItem.titleTamil : activeItem.title}
                  </h2>
                </div>

                <p className="text-sm text-[#635166] leading-relaxed">
                  {activeItem.description}
                </p>

                {/* Primary Actions */}
                <div className="space-y-3 pt-4 border-t border-[#F4EDE0]">
                  <PetalButton
                    href={`/plan?template=${encodeURIComponent(activeItem.id)}&occasion=${encodeURIComponent(activeItem.occasion)}&img=${encodeURIComponent(activeItem.imageUrl)}&title=${encodeURIComponent(activeItem.title)}`}
                    size="md"
                    variant="primary"
                    className="w-full"
                  >
                    {t.galleryPage.planLikeThis}
                  </PetalButton>

                  <button
                    onClick={() => toggleSave(activeItem.id)}
                    className={`w-full py-2.5 rounded-full border text-xs font-serif font-bold flex items-center justify-center gap-2 transition-colors ${
                      savedIds.includes(activeItem.id)
                        ? "bg-[#A8232F] text-white border-[#A8232F]"
                        : "border-[#E8DAC8] text-[#2B1A2E] hover:bg-[#FAF3E7]"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds.includes(activeItem.id) ? "fill-white text-white" : "text-[#A8232F]"
                      }`}
                    />
                    <span>
                      {savedIds.includes(activeItem.id)
                        ? (language === "ta" ? "சேமிக்கப்பட்டது (நீக்க கிளிக் செய்க)" : "Saved in Your Board (Click to Remove)")
                        : (language === "ta" ? "உங்கள் பலகையில் சேமிக்கவும்" : "Save to My Board")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
