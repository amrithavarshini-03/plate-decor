"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, MapPin, Clock, Sparkles, Send } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";
import { triggerPetalBurst } from "@/components/primitives/PetalBurst";

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    occasion: "wedding",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPetalBurst();
    setFormSent(true);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    SITE_CONFIG.whatsappMessage
  )}`;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>Connect With Our Decorators</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1A2E]">
          We&apos;re Here to Arrange With You
        </h1>
        <p className="text-sm sm:text-base text-[#635166]">
          Have questions about seasonal flowers, plate counts, or auspicious muhurtham dates? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct WhatsApp Callout */}
          <div className="p-8 rounded-3xl bg-[#2F5D3A] text-[#FBF6EC] space-y-4 border-2 border-[#E4C580] shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9A62B]">
              Quickest Response
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#FAF3E7]">
              Chat With Us on WhatsApp
            </h3>
            <p className="text-xs text-[#FBF6EC]/80 leading-relaxed">
              Send us your saree photo, mandapam details, or Pinterest board. We reply with initial ideas within 1-2 hours.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFDF9] text-[#2F5D3A] text-xs font-bold shadow-md hover:bg-[#FAF3E7] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#2F5D3A]" />
              <span>Launch WhatsApp: {SITE_CONFIG.phone}</span>
            </a>
          </div>

          {/* Details list */}
          <div className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] space-y-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#2F5D3A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase text-[#635166] block">Phone Consultation</span>
                <span className="text-sm font-semibold text-[#2B1A2E]">{SITE_CONFIG.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#2F5D3A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase text-[#635166] block">Studio Address</span>
                <span className="text-sm font-semibold text-[#2B1A2E]">{SITE_CONFIG.address}</span>
                <p className="text-xs text-[#635166] mt-0.5">Serving Chennai, Madurai, Coimbatore & across Tamil Nadu</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#2F5D3A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase text-[#635166] block">Consultation Hours</span>
                <span className="text-sm font-semibold text-[#2B1A2E]">{SITE_CONFIG.hours}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#E9A62B] shrink-0 mt-0.5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#635166] block">Instagram</span>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#2F5D3A] hover:underline"
                >
                  {SITE_CONFIG.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 border border-[#E8DAC8] shadow-sm">
          {formSent ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center mx-auto">
                ✓
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                Message Received with Reverence
              </h3>
              <p className="text-xs text-[#635166] max-w-sm mx-auto">
                Thank you, {contactForm.name}! Our team will get back to you via WhatsApp / phone shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  Send a Direct Note
                </h3>
                <p className="text-xs text-[#635166]">
                  Leave your details and we will coordinate an auspicious consultation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anandhi Rajan"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 80563 43769"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                    Ceremony Type
                  </label>
                  <select
                    value={contactForm.occasion}
                    onChange={(e) => setContactForm({ ...contactForm, occasion: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E]"
                  >
                    <option value="puberty">Puberty Ceremony (Manjal Neerattu Vizha)</option>
                    <option value="wedding">Wedding Seer Varisai</option>
                    <option value="baby_shower">Valaikappu & Seemantham</option>
                    <option value="housewarming">Housewarming / Festivals</option>
                    <option value="other">Other Celebration</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the function date, venue, and any custom plates you have in mind..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <PetalButton type="submit" size="md" variant="primary" icon={<Send className="w-3.5 h-3.5" />}>
                  Send Consultation Request
                </PetalButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
