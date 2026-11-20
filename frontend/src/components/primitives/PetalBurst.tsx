"use client";

import confetti from "canvas-confetti";

interface TriggerPetalBurstOptions {
  x?: number; // clientX or ratio (0 to 1)
  y?: number; // clientY or ratio (0 to 1)
  particleCount?: number;
  spread?: number;
}

export function triggerPetalBurst(options?: TriggerPetalBurstOptions) {
  if (typeof window === "undefined") return;

  const originX = options?.x !== undefined ? (options.x > 1 ? options.x / window.innerWidth : options.x) : 0.5;
  const originY = options?.y !== undefined ? (options.y > 1 ? options.y / window.innerHeight : options.y) : 0.5;

  const count = options?.particleCount || 28;
  const spread = options?.spread || 60;

  // Authentic floral petal color palette
  const colors = ["#E9A62B", "#F3B94D", "#2F5D3A", "#A8232F", "#F7B2B7", "#FFFDF9"];

  try {
    confetti({
      particleCount: count,
      angle: 90,
      spread: spread,
      origin: { x: originX, y: originY },
      colors: colors,
      shapes: ["circle"],
      scalar: 1.1,
      gravity: 0.9,
      drift: 0,
      ticks: 180,
      disableForReducedMotion: true,
    });
  } catch {
    // Graceful fallback
  }
}

// Easter egg grand shower for the logo plate
export function triggerGrandPetalShower() {
  if (typeof window === "undefined") return;

  const colors = ["#E9A62B", "#F3B94D", "#2F5D3A", "#A8232F", "#F7B2B7", "#FBF6EC"];
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 40 * (timeLeft / duration);

    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      shapes: ["circle"],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      shapes: ["circle"],
      disableForReducedMotion: true,
    });
  }, 250);
}
