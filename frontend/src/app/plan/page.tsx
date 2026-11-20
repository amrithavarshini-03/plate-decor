"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  MessageCircle,
  Plus,
  Minus,
  HelpCircle,
  X,
  ImageIcon,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";
import { triggerGrandPetalShower } from "@/components/primitives/PetalBurst";
import { api, getCustomerUser } from "@/services/api";

export interface UploadedImage {
  url: string;
  name: string;
}

interface BookingFormState {
  // Step 1
  name: string;
  phone: string;
  email: string;
  city: string;
  venue: string;
  date: string;
  // Step 2
  occasion: string;
  customOccasion: string;
  // Step 3
  serviceType: "full_service" | "diy";
  // Step 4
  plateCount: number;
  plateTypes: string[];
  stageRequired: boolean;
  // Step 5
  themeColor: string;
  specialNotes: string;
  deityTheme: string;
  uploadedImages: UploadedImage[];
  // Step 6
  budgetEstimate: string;
}

const INITIAL_STATE: BookingFormState = {
  name: "",
  phone: "",
  email: "",
  city: "Chennai",
  venue: "",
  date: "",
  occasion: "puberty",
  customOccasion: "",
  serviceType: "full_service",
  plateCount: 5,
  plateTypes: ["fruits", "flowers"],
  stageRequired: false,
  themeColor: "",
  specialNotes: "",
  deityTheme: "",
  uploadedImages: [],
  budgetEstimate: "₹8,500 - ₹14,000",
};

export default function PlatePlannerPage() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormState>(INITIAL_STATE);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [step1Attempted, setStep1Attempted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>("");
  const [shopPreference, setShopPreference] = useState<"now" | "later" | null>(null);

  // Pre-fill logged-in customer info
  useEffect(() => {
    const user = getCustomerUser();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.full_name || user.username || "",
        email: prev.email || user.email || "",
      }));
    }
  }, []);

  // Current local YYYY-MM-DD deferred into effect to avoid SSR/prerender timestamp mismatch
  const [todayStr, setTodayStr] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setTodayStr(`${year}-${month}-${day}`);
  }, []);

  const isDateValid = Boolean(formData.date && (!todayStr || formData.date >= todayStr));

  const isStep1Complete =
    formData.name.trim().length >= 2 &&
    formData.phone.trim().length >= 8 &&
    formData.city.trim().length > 0 &&
    isDateValid;

  const handleNextStep = () => {
    if (step === 1) {
      if (!isStep1Complete) {
        setStep1Attempted(true);
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("brb_plate_plan");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restoredDate = parsed.date && parsed.date >= todayStr ? parsed.date : "";
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          date: restoredDate,
          uploadedImages: Array.isArray(parsed.uploadedImages) ? parsed.uploadedImages : [],
          themeColor: parsed.themeColor || (Array.isArray(parsed.themeColors) ? parsed.themeColors.join(", ") : ""),
        }));
      } catch {
        // ignore
      }
    }
  }, [todayStr]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("brb_plate_plan", JSON.stringify(formData));
    } catch {
      // ignore storage quota limit
    }
  }, [formData]);

  // Pricing & 50-50 milestone breakdown calculations (mock rates; actual DB rates can be plugged in later)
  const basePerPlate = formData.serviceType === "full_service" ? 1800 : 450;
  const plateTotal = formData.plateCount * basePerPlate;
  const stageCost = formData.stageRequired ? 12000 : 0;
  const minTotal = Math.round(plateTotal + stageCost);
  const maxTotal = Math.round(minTotal * 1.35);

  const advanceMin = Math.round(minTotal * 0.5);
  const advanceMax = Math.round(maxTotal * 0.5);
  const balanceMin = minTotal - advanceMin;
  const balanceMax = maxTotal - advanceMax;

  const estimatedRangeStr = `₹${minTotal.toLocaleString("en-IN")} - ₹${maxTotal.toLocaleString("en-IN")}`;
  const advanceRangeStr = `₹${advanceMin.toLocaleString("en-IN")} - ₹${advanceMax.toLocaleString("en-IN")}`;
  const balanceRangeStr = `₹${balanceMin.toLocaleString("en-IN")} - ₹${balanceMax.toLocaleString("en-IN")}`;

  // Keep budgetEstimate in sync for persistence
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      budgetEstimate: estimatedRangeStr,
    }));
  }, [formData.plateCount, formData.serviceType, formData.stageRequired]);

  const updateField = <K extends keyof BookingFormState>(field: K, val: BookingFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const togglePlateType = (type: string) => {
    const existing = formData.plateTypes;
    if (existing.includes(type)) {
      if (existing.length > 1) {
        updateField("plateTypes", existing.filter((t) => t !== type));
      }
    } else {
      updateField("plateTypes", [...existing, type]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 7 - formData.uploadedImages.length;
    if (remainingSlots <= 0) {
      setUploadError("You can upload a maximum of 7 inspiration photos.");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    setUploadingImages(true);
    setUploadError(null);

    const newImages: UploadedImage[] = [];

    for (const file of selectedFiles) {
      try {
        const uploaded = await api.uploadFile(file);
        newImages.push({
          url: uploaded.url,
          name: uploaded.filename || file.name,
        });
      } catch {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push({
          url: dataUrl,
          name: file.name,
        });
      }
    }

    updateField("uploadedImages", [...formData.uploadedImages, ...newImages]);
    setUploadingImages(false);
    e.target.value = "";
  };

  const removeUploadedImage = (index: number) => {
    updateField(
      "uploadedImages",
      formData.uploadedImages.filter((_, i) => i !== index)
    );
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const inspirations = formData.uploadedImages.map((img, i) => ({
        type: "image",
        url: img.url,
        preview_title: img.name || `Client Inspiration #${i + 1}`,
      }));

      const res = await api.createBooking({
        customer_name: formData.name || "Client",
        phone: formData.phone || "Not specified",
        email: formData.email || undefined,
        city: formData.city,
        venue: formData.venue || undefined,
        function_date: formData.date || "Upcoming Auspicious Date",
        occasion: formData.occasion,
        custom_occasion: formData.customOccasion || undefined,
        service_type: formData.serviceType,
        plate_count: formData.plateCount,
        plate_types: formData.plateTypes,
        stage_required: formData.stageRequired,
        theme_colors: formData.themeColor.trim() ? [formData.themeColor.trim()] : [],
        notes: formData.specialNotes,
        budget_range: `${estimatedRangeStr} (50% Advance: ${advanceRangeStr} | 50% Balance on Event Day: ${balanceRangeStr})`,
        inspirations,
      });
      setBookingReference(res.id);
    } catch (err) {
      console.warn("Could not post to backend API, using local reference:", err);
      setBookingReference(`BRB-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    } finally {
      setSubmitting(false);
      setIsSubmitted(true);
      triggerGrandPetalShower();
    }
  };

  const occasionsList = [
    { id: "puberty", label: "Puberty Ceremony (Manjal Neerattu)", image: "/images/decor/sevvazhai_golden_lotus.jpg" },
    { id: "wedding", label: "Ceremonial Wedding Seer Varisai", image: "/images/decor/maappillai_penn_dolls_seer.jpg" },
    { id: "baby_shower", label: "Valaikappu & Seemantham", image: "/images/decor/baby_footprint_mandarin_sugar.jpg" },
    { id: "housewarming", label: "Housewarming (Grihapravesam)", image: "/images/decor/sacred_kalasam_ganesha_mandala.jpg" },
    { id: "birthday", label: "Milestone Birthday / Sashtiapthapoorthi", image: "/images/decor/pathinaru_selvangal_coconuts.jpg" },
    { id: "other", label: "Other Traditional Celebration", image: "/images/decor/pistachio_almond_floral_bouquet.jpg" },
  ];

  const currentOccasionObj =
    occasionsList.find((o) => o.id === formData.occasion) || occasionsList[0];

  const whatsappInquiryUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `Vanakkam BRB Decors! I planned a ceremonial plate set on your website:\n\n` +
    `• Reference: ${bookingReference || "Pending"}\n` +
    `• Name: ${formData.name}\n` +
    `• Occasion: ${formData.occasion}\n` +
    `• Date: ${formData.date}\n` +
    `• Plates: ${formData.plateCount}\n` +
    `• Service: ${formData.serviceType === "full_service" ? "Full-Service (Products + Decoration)" : "Decoration Only (Customer Provides Products)"}\n` +
    `• Color Theme: ${formData.themeColor || "Open to recommendation"}\n` +
    `• Inspiration Photos: ${formData.uploadedImages.length > 0 ? `${formData.uploadedImages.length} attached` : "None"}\n` +
    `• Estimated Investment: ${estimatedRangeStr}\n` +
    `• 50% Advance (to reserve slot): ${advanceRangeStr}\n` +
    `• Remaining 50% Balance (after decor on event day): ${balanceRangeStr}\n\n` +
    `Please let me know your availability!`
  )}`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>Interactive Ceremonial Booking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          The Plate Planner
        </h1>
        <p className="text-sm sm:text-base text-[#635166]">
          Every plate is arranged to match your family traditions. Build your set step-by-step.
        </p>
      </div>

      {isSubmitted ? (
        // Confirmation Screen with Petal Shower
        <div className="max-w-2xl mx-auto bg-[#FFFDF9] rounded-3xl border-2 border-[#E4C580] p-8 sm:p-14 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-400">
          <div className="w-24 h-24 rounded-full bg-[#2F5D3A] text-white mx-auto flex items-center justify-center border-4 border-[#FFFDF9] shadow-xl">
            <Check className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E9A62B] block">
              Plate Dream Received
            </span>
            {bookingReference && (
              <span className="inline-block px-3 py-1 rounded-full bg-[#2F5D3A]/10 text-xs font-mono font-bold text-[#2F5D3A] border border-[#2F5D3A]/20">
                Booking ID: {bookingReference}
              </span>
            )}
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1A2E]">
            Your Plate is on its Way to Being Planned!
          </h2>

          <p className="text-sm text-[#635166] leading-relaxed max-w-md mx-auto">
            Vanakkam {formData.name || "cherished client"}! We have recorded your ceremonial plating request for{" "}
            <span className="font-semibold text-[#2F5D3A]">{formData.plateCount} plates</span> on{" "}
            <span className="font-semibold text-[#2B1A2E]">{formData.date || "your auspicious date"}</span>.
          </p>

          <div className="p-5 rounded-2xl bg-[#FAF3E7] border border-[#E4C580] text-xs text-[#2B1A2E] space-y-3 text-left">
            <div className="flex justify-between items-center border-b border-[#E4C580]/60 pb-2">
              <span className="text-[#635166]">Total Estimated Investment</span>
              <span className="font-bold text-sm text-[#2B1A2E]">{estimatedRangeStr}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/90 border border-[#2F5D3A]/20 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2F5D3A] block">
                  Stage 1: 50% Advance
                </span>
                <span className="font-serif text-base font-bold text-[#2F5D3A] block mt-0.5">
                  {advanceRangeStr}
                </span>
                <p className="text-[10px] text-[#635166] mt-1 leading-snug">
                  Paid to confirm date & lock decorator slot once slot availability is verified.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#E4C580] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E9A62B] block">
                  Stage 2: 50% Balance
                </span>
                <span className="font-serif text-base font-bold text-[#2B1A2E] block mt-0.5">
                  {balanceRangeStr}
                </span>
                <p className="text-[10px] text-[#635166] mt-1 leading-snug">
                  Payable on event day at the venue only after decoration work is completed.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-[#635166] pt-2 border-t border-[#E4C580]/40 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2F5D3A] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Extra Charges:</strong> We accept direct UPI (GPay/PhonePe/Paytm), Bank Transfer (NEFT/IMPS), or On-Site Cash/UPI. No gateway surcharges or processing fees!
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2F5D3A] text-[#FBF6EC] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#214229] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#E9A62B]" />
              <span>Say Hello on WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-xs font-semibold text-[#2B1A2E] hover:bg-[#FAF3E7]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: 6-Step Stepper Form */}
          <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E8DAC8] shadow-sm space-y-8">
            {/* Stepper Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#635166]">
                <span>
                  Step {step} of 6:{" "}
                  <strong className="text-[#2F5D3A]">
                    {
                      [
                        "First, the basics",
                        "The occasion",
                        "Service preference",
                        "The plates",
                        "Make it yours",
                        "One last look",
                      ][step - 1]
                    }
                  </strong>
                </span>
                <span>{Math.round((step / 6) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FAF3E7] overflow-hidden">
                <div
                  className="h-full bg-[#E9A62B] transition-all duration-400 ease-out"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Who and When */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  First, the Basics
                </h3>
                <p className="text-xs text-[#635166]">
                  Let us know who we are honoring and when the auspicious muhurtham takes place.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      Your Full Name <span className="text-[#A8232F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Meenakshi"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={`w-full text-xs rounded-xl border p-3 text-[#2B1A2E] focus:outline-none transition-colors ${
                        step1Attempted && !formData.name.trim()
                          ? "border-[#A8232F] bg-[#FFF5F5] focus:border-[#A8232F]"
                          : "border-[#E8DAC8] bg-[#FAF5EE] focus:border-[#2F5D3A]"
                      }`}
                    />
                    {step1Attempted && !formData.name.trim() && (
                      <span className="text-[10px] text-[#A8232F] mt-1 block">Full name is required</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      WhatsApp Phone Number <span className="text-[#A8232F]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 80563 43769"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={`w-full text-xs rounded-xl border p-3 text-[#2B1A2E] focus:outline-none transition-colors ${
                        step1Attempted && formData.phone.trim().length < 8
                          ? "border-[#A8232F] bg-[#FFF5F5] focus:border-[#A8232F]"
                          : "border-[#E8DAC8] bg-[#FAF5EE] focus:border-[#2F5D3A]"
                      }`}
                    />
                    {step1Attempted && formData.phone.trim().length < 8 && (
                      <span className="text-[10px] text-[#A8232F] mt-1 block">Valid phone number is required (min 8 digits)</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      City / Location in Tamil Nadu <span className="text-[#A8232F]">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
                    >
                      <option value="Chennai">Chennai</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                      <option value="Salem">Salem</option>
                      <option value="Tirunelveli">Tirunelveli</option>
                      <option value="Other">Other Tamil Nadu District</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      Function Date <span className="text-[#A8232F]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr || undefined}
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      className={`w-full text-xs rounded-xl border p-3 text-[#2B1A2E] focus:outline-none transition-colors ${
                        (step1Attempted && !formData.date.trim()) || (formData.date && todayStr && formData.date < todayStr)
                          ? "border-[#A8232F] bg-[#FFF5F5] focus:border-[#A8232F]"
                          : "border-[#E8DAC8] bg-[#FAF5EE] focus:border-[#2F5D3A]"
                      }`}
                    />
                    {step1Attempted && !formData.date.trim() && (
                      <span className="text-[10px] text-[#A8232F] mt-1 block">Function date is required</span>
                    )}
                    {formData.date && todayStr && formData.date < todayStr && (
                      <span className="text-[10px] text-[#A8232F] mt-1 block">Past dates cannot be selected. Please choose today or a future date.</span>
                    )}
                  </div>


                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      Venue / Mandapam Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mayor Ramanathan Chettiar Hall, MRC Nagar"
                      value={formData.venue}
                      onChange={(e) => updateField("venue", e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E] focus:outline-none focus:border-[#2F5D3A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: The Occasion */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  Select the Ceremony
                </h3>
                <p className="text-xs text-[#635166]">
                  Different celebrations call for different auspicious elements (turmeric roots, bangles, coconuts, or silver motifs).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {occasionsList.map((occ) => {
                    const isSelected = formData.occasion === occ.id;
                    return (
                      <div
                        key={occ.id}
                        onClick={() => updateField("occasion", occ.id)}
                        className={`cursor-pointer p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                          isSelected
                            ? "bg-[#FAF3E7] border-[#2F5D3A] shadow-sm font-semibold"
                            : "bg-[#FFFDF9] border-[#E8DAC8] hover:bg-[#FAF5EE]"
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E4C580]">
                          <Image src={occ.image} alt={occ.label} fill className="object-cover" />
                        </div>
                        <span className="text-xs text-[#2B1A2E] leading-snug">{occ.label}</span>
                      </div>
                    );
                  })}
                </div>

                {formData.occasion === "other" && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                      Specify Celebration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayushya Homam / Upanayanam"
                      value={formData.customOccasion}
                      onChange={(e) => updateField("customOccasion", e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service Type (Full-Service vs Decoration Only) */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  Select Decoration Service Type
                </h3>
                <p className="text-xs text-[#635166]">
                  Choose whether you want BRB Decors to provide both the products and decoration, or prefer to supply the products yourself and pay only for our decoration work.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Option 1: Full-Service (Products + Decoration) */}
                  <div
                    onClick={() => updateField("serviceType", "full_service")}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      formData.serviceType === "full_service"
                        ? "bg-[#FAF3E7] border-[#2F5D3A] shadow-md ring-1 ring-[#2F5D3A]"
                        : "bg-[#FFFDF9] border-[#E8DAC8] hover:border-[#2F5D3A]/50"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F5D3A] bg-[#2F5D3A]/10 px-2.5 py-0.5 rounded-full">
                          All-Inclusive (Products + Work)
                        </span>
                        {formData.serviceType === "full_service" && (
                          <span className="w-5 h-5 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#2B1A2E]">
                          Full-Service Decoration
                        </h4>
                        <p className="text-[11px] font-medium text-[#2F5D3A] mt-0.5">
                          You pay for both products and decoration work
                        </p>
                      </div>
                      <p className="text-xs text-[#635166] leading-relaxed">
                        Our team procures all fresh fruits, flowers, sweets, dry fruits, and brass plates, then professionally styles each plate and delivers them directly to your mandapam or venue.
                      </p>
                      <ul className="space-y-1.5 pt-2 border-t border-[#E8DAC8]/60 text-[11px] text-[#2B1A2E]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2F5D3A] shrink-0" />
                          <span>BRB Decors purchases & supplies all materials</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2F5D3A] shrink-0" />
                          <span>Professional plate styling & venue delivery</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2F5D3A] shrink-0" />
                          <span>Zero shopping or preparation needed from you</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Option 2: Decoration Only (Customer Provides Products) */}
                  <div
                    onClick={() => updateField("serviceType", "diy")}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      formData.serviceType === "diy"
                        ? "bg-[#FAF3E7] border-[#C88515] shadow-md ring-1 ring-[#C88515]"
                        : "bg-[#FFFDF9] border-[#E8DAC8] hover:border-[#C88515]/50"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88515] bg-[#C88515]/10 px-2.5 py-0.5 rounded-full">
                          Decoration Only (You Supply Items)
                        </span>
                        {formData.serviceType === "diy" && (
                          <span className="w-5 h-5 rounded-full bg-[#C88515] text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#2B1A2E]">
                          Decoration Only
                        </h4>
                        <p className="text-[11px] font-medium text-[#C88515] mt-0.5">
                          You pay only for our decoration work
                        </p>
                      </div>
                      <p className="text-xs text-[#635166] leading-relaxed">
                        You supply the products (fruits, sweets, and plates) — using your own heirloom items, or buying from our recommended Amazon links and partner shops on &apos;Shop the Look&apos; with BRB Decors discounts. Our decorators handle all the decoration work.
                      </p>
                      <ul className="space-y-1.5 pt-2 border-t border-[#E8DAC8]/60 text-[11px] text-[#2B1A2E]">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C88515] shrink-0" />
                          <span>Pay only for decoration work (save on material markups)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C88515] shrink-0" />
                          <span>Provide your own items or buy via &apos;Shop the Look&apos;</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C88515] shrink-0" />
                          <span>BRB Decors expertly decorates and styles your plates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Decoration Only: Shop the Look Banner (Shop Now or Later) */}
                {formData.serviceType === "diy" && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] border-2 border-[#E9A62B]/60 shadow-md space-y-3.5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88515] bg-[#C88515]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Curated DIY Trays & Materials
                          </span>
                          {shopPreference === "later" && (
                            <span className="text-[10px] font-semibold text-[#2F5D3A] bg-[#2F5D3A]/10 px-2 py-0.5 rounded-full">
                              ✓ Saved for Step 6 Review
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2B1A2E]">
                          Need trays, brass plates, deity figurines, or craft tools?
                        </h4>
                        <p className="text-xs text-[#635166] leading-relaxed">
                          You supply the items for this order. You can use your family heirlooms, or source them from our curated <strong>Shop the Look</strong> collection with exclusive vendor discounts (10–15% off in Chennai, Madurai & Coimbatore).
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="/shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F5D3A] text-white text-xs font-bold shadow-sm hover:bg-[#214229] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>Shop the Look Now (Opens New Tab)</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setShopPreference("later")}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          shopPreference === "later"
                            ? "bg-[#FAF3E7] text-[#2F5D3A] border-[#2F5D3A] ring-1 ring-[#2F5D3A]"
                            : "bg-white text-[#635166] border-[#E8DAC8] hover:border-[#2F5D3A]/50 hover:text-[#2B1A2E]"
                        }`}
                      >
                        {shopPreference === "later" ? "✓ Reminder set for Step 6" : "Shop Later (Remind Me in Step 6)"}
                      </button>
                    </div>

                    {shopPreference === "later" && (
                      <div className="p-2.5 rounded-xl bg-[#2F5D3A]/10 border border-[#2F5D3A]/20 text-xs text-[#2F5D3A] font-medium flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>
                          Choice saved! You can complete your plate design now. We will display the <strong>Shop the Look</strong> link on your final Step 6 review page.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: The Plates Quantity & Types */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                    The Plates & Quantities
                  </h3>
                  <p className="text-xs text-[#635166]">
                    Traditional seer varisai typically consists of odd-numbered sets (5, 7, 11, or 21 plates).
                  </p>
                </div>

                {/* Plate Quantity Stepper */}
                <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E8DAC8] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#2B1A2E] block">
                      Number of Plates
                    </span>
                    <span className="text-[11px] text-[#635166]">
                      Odd counts (5, 7, 11, 21) are considered auspicious.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("plateCount", Math.max(1, formData.plateCount - 1))}
                      className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] flex items-center justify-center hover:bg-[#E8DAC8]"
                    >
                      <Minus className="w-4 h-4 text-[#2B1A2E]" />
                    </button>
                    <span className="font-serif text-2xl font-bold text-[#2F5D3A] w-8 text-center">
                      {formData.plateCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateField("plateCount", formData.plateCount + 1)}
                      className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] flex items-center justify-center hover:bg-[#E8DAC8]"
                    >
                      <Plus className="w-4 h-4 text-[#2B1A2E]" />
                    </button>
                  </div>
                </div>

                {/* Plate Types Multi-select */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#2B1A2E]">
                    Types of Plates Desired (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: "fruits", label: "Fresh Fruit Mandalas" },
                      { id: "flowers", label: "Floral Garlands & Rings" },
                      { id: "sweets_dryfruits", label: "Dry Fruits & Confections" },
                      { id: "deity", label: "Deity Figurine / Kalasam" },
                      { id: "baby_theme", label: "Cradle / Cutout Theme" },
                    ].map((item) => {
                      const isChecked = formData.plateTypes.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => togglePlateType(item.id)}
                          className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-colors ${
                            isChecked
                              ? "bg-[#FAF3E7] border-[#2F5D3A] text-[#2F5D3A] font-semibold"
                              : "bg-[#FFFDF9] border-[#E8DAC8] text-[#635166]"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#2F5D3A]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Backdrop Toggle */}
                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DAC8] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#2B1A2E] block">
                      Include Ceremonial Stage Backdrop?
                    </span>
                    <span className="text-[11px] text-[#635166]">
                      Banana tree trunks, hanging marigold ropes & brass urlis.
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.stageRequired}
                    onChange={(e) => updateField("stageRequired", e.target.checked)}
                    className="w-5 h-5 accent-[#2F5D3A] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Make It Yours (Themes & Mood Board) */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                    Make It Yours
                  </h3>
                  <p className="text-xs text-[#635166]">
                    Upload reference photos, mention an optional color palette, or note any special deity and brass requests.
                  </p>
                </div>

                {/* Optional Color Theme Text Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#2B1A2E]">
                      Ceremonial Color Theme
                    </label>
                    <span className="text-[11px] text-[#635166] font-normal italic">Optional</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Marigold & Green, Pastel Pink & Gold, or leave blank"
                    value={formData.themeColor}
                    onChange={(e) => updateField("themeColor", e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E] placeholder:text-[#635166]/60 focus:outline-none focus:border-[#2F5D3A]"
                  />
                  <p className="text-[11px] text-[#635166]">
                    Specify any preferred colors, or leave blank for our decorators to curate the palette.
                  </p>
                </div>

                {/* Multi-Image Inspiration Uploader (up to 7 images) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B1A2E]">
                        Inspiration Photos
                      </label>
                      <p className="text-[11px] text-[#635166]">
                        Upload photos from Instagram, Pinterest, or your gallery showing plate styles you like.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF3E7] border border-[#E4C580] text-[#8C5D0B]">
                      {formData.uploadedImages.length} / 7
                    </span>
                  </div>

                  {/* Dropzone Upload Button */}
                  {formData.uploadedImages.length < 7 ? (
                    <label
                      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                        uploadingImages
                          ? "border-[#2F5D3A] bg-[#2F5D3A]/5 cursor-wait"
                          : "border-[#E8DAC8] bg-[#FAF5EE]/60 hover:border-[#2F5D3A] hover:bg-[#FAF3E7]"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                        disabled={uploadingImages || formData.uploadedImages.length >= 7}
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E8DAC8] flex items-center justify-center text-[#2F5D3A] mb-2 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#2B1A2E]">
                        {uploadingImages ? "Uploading photos..." : "Click to browse or drag photos here"}
                      </span>
                      <span className="text-[11px] text-[#635166] mt-0.5">
                        JPG, PNG, WebP • Up to {7 - formData.uploadedImages.length} more {7 - formData.uploadedImages.length === 1 ? "photo" : "photos"} (Max 10MB each)
                      </span>
                    </label>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#FAF3E7] border border-[#E8DAC8] text-center text-xs text-[#8C5D0B]">
                      Maximum of 7 inspiration photos reached. Click × on any photo to remove it and upload a different one.
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-[#A8232F]">{uploadError}</p>
                  )}

                  {/* Uploaded Thumbnails Grid */}
                  {formData.uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {formData.uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-[#E8DAC8] bg-white shadow-xs aspect-square"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.name || `Inspiration ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/65 text-[10px] text-white font-semibold">
                            Photo #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            title="Remove photo"
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-[#A8232F] text-white text-xs flex items-center justify-center transition-colors shadow-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                    Special Notes or Deity Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please include Kamadhenu brass statue and extra jasmine strands."
                    value={formData.specialNotes}
                    onChange={(e) => updateField("specialNotes", e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] p-3 text-[#2B1A2E]"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Review & Send */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                    One Last Look
                  </h3>
                  <p className="text-xs text-[#635166]">
                    Review your ceremonial summary before sending your plate dream to our decor studio.
                  </p>
                </div>

                {/* Summary Table */}
                <div className="p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DAC8] space-y-3 text-xs">
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Host Name</span>
                    <span className="font-semibold text-[#2B1A2E]">{formData.name || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Occasion</span>
                    <span className="font-semibold text-[#2B1A2E] capitalize">
                      {formData.occasion.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Date & City</span>
                    <span className="font-semibold text-[#2B1A2E]">
                      {formData.date || "TBD"} ({formData.city})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Service Preference</span>
                    <span className="font-semibold text-[#2F5D3A]">
                      {formData.serviceType === "full_service"
                        ? "Full-Service (Products + Decoration)"
                        : "Decoration Only (Customer Provides Products)"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Plates Configured</span>
                    <span className="font-semibold text-[#2B1A2E]">
                      {formData.plateCount} Decorative Thaalams
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DAC8]/60 pb-2">
                    <span className="text-[#635166]">Color Theme</span>
                    <span className="font-semibold text-[#2B1A2E]">
                      {formData.themeColor || "Decorator's choice"}
                    </span>
                  </div>
                  {formData.uploadedImages.length > 0 && (
                    <div className="border-b border-[#E8DAC8]/60 pb-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#635166]">Inspiration Photos</span>
                        <span className="font-semibold text-[#2F5D3A]">
                          {formData.uploadedImages.length} attached
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {formData.uploadedImages.map((img, i) => (
                          <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-[#E8DAC8] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-[#2B1A2E] font-bold text-sm">Estimated Total Range</span>
                    <span className="font-serif text-base font-bold text-[#2B1A2E]">
                      {estimatedRangeStr}
                    </span>
                  </div>
                </div>

                {/* 50% Advance & 50% Event Day Balance Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] border-2 border-[#E4C580] space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#2F5D3A] text-[#FBF6EC] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      50
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#2B1A2E]">
                        Transparent 2-Stage Payment Structure
                      </h4>
                      <p className="text-[11px] text-[#635166]">
                        50% Advance to confirm your slot, 50% Balance on event day after setup.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Stage 1: 50% Advance */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#2F5D3A]/30 shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F5D3A]">
                          1. Advance (50%)
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2F5D3A]/10 text-[#2F5D3A]">
                          To Confirm Slot
                        </span>
                      </div>
                      <div className="font-serif text-lg font-bold text-[#2F5D3A]">
                        {advanceRangeStr}
                      </div>
                      <p className="text-[11px] text-[#635166] leading-relaxed">
                        Paid after our team verifies muhurtham slot availability. Reserves the lead decorator and begins artisan prep.
                      </p>
                    </div>

                    {/* Stage 2: 50% Balance */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E4C580] shadow-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9A62B]">
                          2. Balance (50%)
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF3E7] text-[#976008]">
                          On Event Day
                        </span>
                      </div>
                      <div className="font-serif text-lg font-bold text-[#2B1A2E]">
                        {balanceRangeStr}
                      </div>
                      <p className="text-[11px] text-[#635166] leading-relaxed">
                        Payable at the mandapam / venue on the day of the event <strong>only after</strong> all plate decoration work is fully completed.
                      </p>
                    </div>
                  </div>

                  {/* Zero Extra Surcharge Guarantee */}
                  <div className="p-3 rounded-xl bg-[#2F5D3A]/5 border border-[#2F5D3A]/15 text-[11px] text-[#2B1A2E] space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#2F5D3A]">
                      <ShieldCheck className="w-4 h-4 text-[#2F5D3A]" />
                      <span>Zero Extra Charges (0% Processing Fees)</span>
                    </div>
                    <p className="text-[#635166] leading-relaxed">
                      We do not charge 2% – 3% gateway convenience fees. You can pay via <strong>Direct UPI</strong> (GPay, PhonePe, Paytm), <strong>Direct Bank Transfer</strong> (NEFT / IMPS), or <strong>On-Site Cash / UPI</strong> on the event day.
                    </p>
                  </div>
                </div>

                {/* Step 6: Shop the Look Banner for Decoration Only */}
                {formData.serviceType === "diy" && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] border-2 border-[#C88515] space-y-3.5 shadow-md animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88515] bg-[#C88515]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Reminder: Decoration Only Selected
                          </span>
                          <span className="text-[10px] font-semibold text-[#2F5D3A] bg-[#2F5D3A]/10 px-2 py-0.5 rounded-full">
                            Customer Supplies Materials
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2B1A2E]">
                          Ready to arrange your plates, brass trays & figurines?
                        </h4>
                        <p className="text-xs text-[#635166] leading-relaxed">
                          As you selected <strong>Decoration Only</strong>, please ensure your brass trays, fresh fruits, flowers, or deity figurines are ready before the ceremony date. Visit our curated <strong>Shop the Look</strong> collection for recommended links and exclusive 10–15% partner store discounts across Tamil Nadu.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      <a
                        href="/shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C88515] text-white text-xs font-bold shadow-md hover:bg-[#a56b0c] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Browse & Shop the Look ➔</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                      <span className="text-[11px] text-[#635166]">
                        (Opens in a new tab — your plan details will remain saved)
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DAC8] text-[11px] text-[#635166]">
                  💡 <strong>No payment is taken right now.</strong> Click below to submit your details and request this slot. We will confirm auspicious slot availability with you first.
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-[#F4EDE0] space-y-2">
              <div className="flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-full border border-[#E8DAC8] text-xs font-semibold text-[#2B1A2E] hover:bg-[#FAF3E7] flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 6 ? (
                  <PetalButton
                    onClick={handleNextStep}
                    disabled={step === 1 && !isStep1Complete}
                    size="md"
                    variant="primary"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Continue to Next Step
                  </PetalButton>
                ) : (
                  <PetalButton
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    size="lg"
                    variant="primary"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    {submitting ? "Arranging & Submitting..." : "Send My Plate Dream"}
                  </PetalButton>
                )}
              </div>

              {step === 1 && !isStep1Complete && (
                <p className="text-right text-[11px] text-[#A8232F] italic">
                  * Please fill in your name, WhatsApp number, and function date to continue to the next step.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Live 3D Interactive Thaalam Stage */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#E4C580] shadow-xl text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9A62B]">
                Live Thaalam Preview
              </span>

              {/* 3D Round Plate Frame with Visual Rims & Continuous Subtle Motion */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full border-4 border-[#E4C580] p-3 shadow-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] flex items-center justify-center">
                {/* Visual Stacked Plates Backing based on plateCount */}
                {[...Array(Math.min(5, Math.max(1, formData.plateCount)))].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-[#E4C580]/40 pointer-events-none transition-transform duration-500"
                    style={{
                      transform: `translate(${i * 2}px, ${i * -3}px) scale(${1 - i * 0.02})`,
                      zIndex: -i,
                    }}
                  />
                ))}

                {/* Main 3D Photographic Plate with Smooth Hover Orbit */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner border border-[#E8DAC8]">
                  <Image
                    src={currentOccasionObj.image}
                    alt={currentOccasionObj.label}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* Plate Counter Summary Badge */}
              <div className="pt-2">
                <h4 className="font-serif text-lg font-bold text-[#2B1A2E]">
                  {currentOccasionObj.label}
                </h4>
                <p className="text-xs text-[#2F5D3A] font-semibold mt-0.5">
                  Set of {formData.plateCount} Arranged Plates
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E8DAC8]/60 space-y-1.5 text-left bg-[#FAF5EE] rounded-xl p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#635166]">Est. Total:</span>
                    <span className="font-bold text-[#2B1A2E]">{estimatedRangeStr}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#2F5D3A]">
                    <span className="font-semibold">50% Advance:</span>
                    <span className="font-bold">{advanceRangeStr}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#635166]">
                    <span>50% On Event Day:</span>
                    <span className="font-medium text-[#2B1A2E]">{balanceRangeStr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
