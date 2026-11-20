"use client";

import React, { useState } from "react";
import Link from "next/link";
import { triggerPetalBurst } from "./PetalBurst";

interface PetalButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "kumkum" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function PetalButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  type = "button",
  disabled = false,
}: PetalButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    // Get click coordinates relative to button for radial spreading ring
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });

    // Trigger subtle petal burst
    triggerPetalBurst({ x: e.clientX, y: e.clientY, particleCount: 16, spread: 45 });

    if (onClick) {
      onClick(e);
    }

    setTimeout(() => {
      setRipple((prev) => ({ ...prev, active: false }));
    }, 600);
  };

  // Base sizing
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base tracking-wide",
  }[size];

  // Variant themes
  const variantStyles = {
    primary:
      "bg-[#2F5D3A] text-[#FBF6EC] border border-[#214229] shadow-[0_4px_16px_rgba(47,93,58,0.25)] hover:shadow-[0_8px_24px_rgba(47,93,58,0.35)]",
    secondary:
      "bg-[#FFFDF9] text-[#2B1A2E] border-2 border-[#E4C580] shadow-[0_4px_16px_rgba(184,142,63,0.15)] hover:border-[#E9A62B] hover:text-[#2F5D3A]",
    kumkum:
      "bg-[#A8232F] text-[#FFFDF9] border border-[#8A1B25] shadow-[0_4px_20px_rgba(168,35,47,0.3)] hover:shadow-[0_8px_28px_rgba(168,35,47,0.4)]",
    ghost:
      "bg-transparent text-[#2B1A2E] border border-transparent hover:border-[#E8DAC8] hover:bg-[#F4EDE0]/50",
  }[variant];

  // Betel-leaf asymmetrical organic rounded pill
  const leafPillShape = "rounded-[999px] font-medium transition-all duration-300 relative overflow-hidden group inline-flex items-center justify-center gap-2.5 select-none";

  const content = (
    <>
      {/* Expanding radial ring on hover */}
      <span className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <span className="w-0 h-0 rounded-full bg-white/20 transition-all duration-500 ease-out group-hover:w-[350px] group-hover:h-[350px]" />
      </span>

      {/* Spreading click ring */}
      {ripple.active && (
        <span
          className="absolute z-0 rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{
            top: ripple.y - 20,
            left: ripple.x - 20,
            width: 40,
            height: 40,
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={`${leafPillShape} ${sizeStyles} ${variantStyles} ${className} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${leafPillShape} ${sizeStyles} ${variantStyles} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {content}
    </button>
  );
}
