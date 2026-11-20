"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PetalButton } from "@/components/primitives/PetalButton";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl border-2 border-[#E4C580] p-8 sm:p-10 text-center shadow-xl space-y-6">
        {/* Animated Empty Brass Plate */}
        <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-[#E4C580] overflow-hidden p-2 bg-[#FAF5EE] shadow-inner animate-pulse">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/images/placeholders/tray_raw.jpg"
              alt="Empty Thaalam Plate"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E9A62B]">
            Page Not Found • 404
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B1A2E]">
            This Plate is Empty.
          </h1>
          <p className="font-serif italic text-base text-[#635166]">
            “BRB, taking you back to the celebration.”
          </p>
        </div>

        <div className="pt-2">
          <PetalButton href="/" size="md" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Return to Home
          </PetalButton>
        </div>
      </div>
    </div>
  );
}
