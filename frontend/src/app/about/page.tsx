"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart, Sun, Award } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>The Art of Ceremonial Plating</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1A2E]">
          Our Story & Philosophy
        </h1>
        <p className="font-handwriting text-2xl text-[#2F5D3A] italic">
          “BRB, we’re arranging something beautiful”
        </p>
      </div>

      {/* Story Sections */}
      <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-14 border border-[#E8DAC8] shadow-sm space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E]">
              Born Around Family Thaalams
            </h2>
            <p className="text-sm text-[#635166] leading-relaxed">
              In Tamil culture, no auspicious celebration begins without the passing of the plates. From the golden virali manjal roots in a puberty ceremony thaalam to the grand 21 seer varisai trays carried into a marriage mandapam, the plate is where blessings are held.
            </p>
            <p className="text-sm text-[#635166] leading-relaxed">
              {SITE_CONFIG.businessName} started as a family passion in Chennai. When our relatives saw the care with which we carved sweet melons, shaped dry fruit peacocks, and hand-wove jasmine strands, they urged us to bring this sacred craft to celebrations across Tamil Nadu.
            </p>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 rounded-full border-4 border-[#E4C580] overflow-hidden p-2 bg-[#FAF5EE] shadow-xl">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/images/decor/vetrilai_mandala_lemon.jpg"
                  alt="Ceremonial Plating Craft"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Our Craft */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#F4EDE0]">
          <div className="p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DAC8] space-y-3">
            <Sun className="w-6 h-6 text-[#E9A62B]" />
            <h3 className="font-serif text-lg font-bold text-[#2B1A2E]">
              Dawn Market Sourcing
            </h3>
            <p className="text-xs text-[#635166] leading-relaxed">
              We never use stale flowers. We personally source dew-fresh marigolds, tuberoses, and Madurai jasmine at dawn on your ceremony morning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DAC8] space-y-3">
            <Heart className="w-6 h-6 text-[#A8232F]" />
            <h3 className="font-serif text-lg font-bold text-[#2B1A2E]">
              Sacred Proportions
            </h3>
            <p className="text-xs text-[#635166] leading-relaxed">
              Every arrangement follows traditional radial geometry. Concentric circles draw the gaze inward toward the auspicious centerpiece.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DAC8] space-y-3">
            <Award className="w-6 h-6 text-[#2F5D3A]" />
            <h3 className="font-serif text-lg font-bold text-[#2B1A2E]">
              Punctual Mandapam Setup
            </h3>
            <p className="text-xs text-[#635166] leading-relaxed">
              We arrive two hours prior to the auspicious muhurtham. Every leaf is polished, every fruit placed, before your first guest steps through the doors.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
          Ready to Arrange Your Celebration?
        </h3>
        <PetalButton href="/plan" size="lg" variant="primary">
          Begin Your Plate
        </PetalButton>
      </div>
    </div>
  );
}
