"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, User, LogOut, ShoppingBag } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { PetalButton } from "@/components/primitives/PetalButton";
import { triggerGrandPetalShower } from "@/components/primitives/PetalBurst";
import { getCustomerUser, removeCustomerToken, CustomerUser } from "@/services/api";

export function Header() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);

  useEffect(() => {
    setCustomer(getCustomerUser());
  }, [pathname]);

  const handleCustomerLogout = () => {
    removeCustomerToken();
    setCustomer(null);
  };

  // Easter egg: double click or hold logo plate
  const handleLogoEasterEgg = () => {
    setIsSpinning(true);
    triggerGrandPetalShower();
    setTimeout(() => setIsSpinning(false), 1200);
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/plan", label: t.nav.planner },
    { href: "/shop", label: t.nav.shop },
    { href: "/packages", label: t.nav.packages },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF6EC]/90 backdrop-blur-md border-b border-[#E8DAC8]/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo with Easter Egg Plate */}
        <div className="flex items-center gap-3">
          <button
            onDoubleClick={handleLogoEasterEgg}
            title="Double-click for a celebration!"
            className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
            aria-label="BRB Decors Home - Double click for petal shower"
          >
            {/* The Logo Thaalam Plate */}
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] border-2 border-[#E4C580] shadow-[0_4px_12px_rgba(184,142,63,0.2)] flex items-center justify-center transition-transform duration-700 ${
                isSpinning ? "rotate-[720deg] scale-110" : "group-hover:rotate-45"
              }`}
            >
              <svg viewBox="0 0 32 32" className="w-8 h-8">
                {/* 4 Banana leaf quadrants */}
                <circle cx="16" cy="16" r="14" fill="#FFFDF9" />
                <path d="M16 6 C13 11 13 16 16 16 C19 16 19 11 16 6 Z" fill="#2F5D3A" />
                <path d="M26 16 C21 13 16 13 16 16 C16 19 21 19 26 16 Z" fill="#2F5D3A" />
                <path d="M16 26 C13 21 13 16 16 16 C19 16 19 21 16 26 Z" fill="#2F5D3A" />
                <path d="M6 16 C11 13 16 13 16 16 C16 19 11 19 6 16 Z" fill="#2F5D3A" />
                {/* Marigold petals */}
                <circle cx="16" cy="11" r="2.5" fill="#E9A62B" />
                <circle cx="21" cy="16" r="2.5" fill="#E9A62B" />
                <circle cx="16" cy="21" r="2.5" fill="#E9A62B" />
                <circle cx="11" cy="16" r="2.5" fill="#E9A62B" />
                {/* Center Kumkum core */}
                <circle cx="16" cy="16" r="2.5" fill="#A8232F" />
              </svg>
            </div>
          </button>

          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2B1A2E] leading-none">
              {SITE_CONFIG.businessName}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#2F5D3A] font-semibold mt-0.5">
              Ceremonial Plating
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                  isActive ? "text-[#2F5D3A] font-semibold" : "text-[#2B1A2E]/80 hover:text-[#2F5D3A]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#E9A62B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions: Language Toggle & Primary CTA */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Replay Intro Splash Button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("replay-ceremonial-splash"));
              }
            }}
            className="flex items-center gap-1.5 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] px-3 py-1.5 text-xs font-medium text-[#2B1A2E] hover:border-[#E9A62B] hover:text-[#9B6F1C] hover:bg-[#FAF3E7] transition-all duration-200 shadow-sm cursor-pointer"
            title="Replay Ceremonial Welcome / மங்கலத் தட்டு திறப்பு"
            aria-label="Replay Welcome Splash"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
            <span className="hidden xl:inline text-[11px] font-semibold text-[#8B5E14]">
              {language === "ta" ? "மங்கலத் தட்டு" : "Replay Intro"}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center rounded-full border border-[#E8DAC8] bg-[#FFFDF9] px-3 py-1.5 text-xs font-medium text-[#2B1A2E] hover:border-[#2F5D3A] transition-all duration-200 shadow-sm"
            title="Switch Language / மொழியை மாற்ற"
          >
            <span className={language === "en" ? "font-bold text-[#2F5D3A]" : "text-[#635166]"}>
              EN
            </span>
            <span className="mx-1.5 text-[#E8DAC8]">|</span>
            <span className={language === "ta" ? "font-bold text-[#2F5D3A]" : "text-[#635166]"}>
              தமிழ்
            </span>
          </button>

          {/* My Orders Button */}
          <Link
            href="/my-orders"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow-2xs ${
              pathname === "/my-orders"
                ? "bg-[#2F5D3A] text-white border-[#2F5D3A]"
                : "bg-[#FFFDF9] border-[#E8DAC8] text-[#2B1A2E] hover:border-[#2F5D3A] hover:bg-[#FAF3E7]"
            }`}
            title="View My Ceremonial Orders & Quotes"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E9A62B]" />
            <span>My Orders</span>
          </Link>

          {/* Customer Auth Button */}
          {customer ? (
            <div className="flex items-center gap-1.5 bg-[#FAF3E7] border border-[#E8DAC8] rounded-full px-3 py-1 text-xs">
              <Link href="/my-orders" className="flex items-center gap-1.5 hover:underline" title="View Profile & Orders">
                <User className="w-3.5 h-3.5 text-[#2F5D3A]" />
                <span className="font-semibold text-[#2B1A2E] max-w-[100px] truncate">
                  {customer.full_name || customer.username}
                </span>
              </Link>
              <button
                onClick={handleCustomerLogout}
                title="Sign Out"
                className="ml-1 text-[#A8232F] hover:text-red-700 p-0.5 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-xs font-semibold text-[#2B1A2E] hover:border-[#2F5D3A] hover:bg-[#FAF3E7] transition-all duration-200 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#2F5D3A]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Primary CTA */}
          <PetalButton href="/plan" size="sm" variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
            {t.nav.beginPlate}
          </PetalButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-xs font-semibold text-[#2F5D3A]"
          >
            {language === "en" ? "தமிழ்" : "EN"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#2B1A2E] hover:bg-[#F4EDE0] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E8DAC8] px-6 py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1.5 border-b border-[#F4EDE0] ${
                  pathname === link.href ? "text-[#2F5D3A] font-bold" : "text-[#2B1A2E]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("replay-ceremonial-splash"));
                }
              }}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-[#E9A62B]/50 bg-[#FAF3E7] text-xs font-semibold text-[#8B5E14] hover:bg-[#F3E6D0] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
              <span>{language === "ta" ? "மங்கலத் தட்டு திறப்பு காண" : "Replay Ceremonial Intro"}</span>
            </button>

            {/* My Orders in Mobile Menu */}
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF9] border border-[#E4C580] text-xs font-bold text-[#2B1A2E] shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#2F5D3A]" />
                <span>My Orders & Quotations</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-[#8B5E14] bg-[#FAF3E7] px-2 py-0.5 rounded-full border border-[#E8DAC8]">
                View
              </span>
            </Link>

            {/* Customer Login in Mobile Menu */}
            {customer ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF3E7] border border-[#E8DAC8]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2F5D3A]" />
                  <span className="text-xs font-semibold text-[#2B1A2E]">
                    {customer.full_name || customer.username}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleCustomerLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-[#A8232F] font-semibold hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2F5D3A] bg-[#2F5D3A]/5 text-xs font-bold text-[#2F5D3A]"
              >
                <User className="w-4 h-4" />
                <span>Customer Sign In / Create Account</span>
              </Link>
            )}

            <div className="pt-2">
              <PetalButton
                href="/plan"
                size="md"
                variant="primary"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.beginPlate}
              </PetalButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
