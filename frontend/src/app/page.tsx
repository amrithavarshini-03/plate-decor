"use client";

import React from "react";
import { ScrollStoryHero } from "@/components/home/ScrollStoryHero";
import { GarlandDivider } from "@/components/primitives/GarlandDivider";
import { OccasionSelector } from "@/components/home/OccasionSelector";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* 1. Welcoming Ceremonial Hero (Randomized real works 1-6 in regal frame) */}
      <ScrollStoryHero />

      {/* Garland Thoranam Section Divider */}
      <GarlandDivider />

      {/* 2. What We Arrange (Display showcase using images 8, 9, 10, 11) */}
      <OccasionSelector />
    </div>
  );
}
