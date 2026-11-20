"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, MapPin, Tag, ExternalLink, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";
import { api } from "@/services/api";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  affiliateUrl: string;
  note: string;
}

interface StoreItem {
  id: string;
  name: string;
  area: string;
  city: string;
  specialty: string;
  discountNote: string;
  mapUrl: string;
}

export default function ShopPage() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const products: ProductItem[] = [
    {
      id: "p1",
      name: "16-Inch Solid Brass Beaded Thaalam Tray",
      category: "trays",
      price: "₹1,850",
      image: "/images/decor/vetrilai_mandala_lemon.jpg",
      affiliateUrl: "https://amazon.in",
      note: "Heavy authentic brass base; perfect foundation for fruit & seer varisai plates.",
    },
    {
      id: "p2",
      name: "Kundan Geometric Brocade Dry Fruit Base Box",
      category: "tools",
      price: "₹650",
      image: "/images/decor/royal_dry_fruit_square_mandala.jpg",
      affiliateUrl: "https://amazon.in",
      note: "Embroidered velvet and lace frame for artisan dry fruit arrangements.",
    },
    {
      id: "p3",
      name: "Mandarin & Sugar Crystal Footprint Crafting Base",
      category: "toppers",
      price: "₹450",
      image: "/images/decor/baby_footprint_mandarin_sugar.jpg",
      affiliateUrl: "https://amazon.in",
      note: "Diamond rock sugar crystals & food-safe arrangement bed for baby shower thaalams.",
    },
    {
      id: "p4",
      name: "Handmade Bridal Couple (Maappillai & Penn) Dolls",
      category: "trays",
      price: "₹550",
      image: "/images/decor/maappillai_penn_dolls_seer.jpg",
      affiliateUrl: "https://amazon.in",
      note: "Silk veshti and Kanjeevaram sari miniature fabric couple for auspicious wedding seer varisai.",
    },
  ];

  const stores: StoreItem[] = [
    {
      id: "s1",
      name: "Giri Trading Agency",
      area: "Mylapore (Near Kapaleeshwarar Temple)",
      city: "Chennai",
      specialty: "Authentic brass pooja trays, deity idols, and pooja materials.",
      discountNote: `Mention "${SITE_CONFIG.businessName}" at billing for 10% off trays.`,
      mapUrl: "https://maps.google.com",
    },
    {
      id: "s2",
      name: "Madurai Maligai & Flower Bazaar",
      area: "Mattuthavani Flower Market",
      city: "Madurai",
      specialty: "Fresh Madurai Malli (jasmine), marigold strings, and lotus blooms.",
      discountNote: `Mention "${SITE_CONFIG.businessName}" for wholesale market rates.`,
      mapUrl: "https://maps.google.com",
    },
    {
      id: "s3",
      name: "Sri Annapoorna Crafts & Metalworks",
      area: "RS Puram",
      city: "Coimbatore",
      specialty: "Handcrafted brass and bronze urlis, stands, and seer plate bases.",
      discountNote: `Mention "${SITE_CONFIG.businessName}" for 12% off decorative hardware.`,
      mapUrl: "https://maps.google.com",
    },
  ];

  const [productList, setProductList] = useState<ProductItem[]>(products);
  const [storeList, setStoreList] = useState<StoreItem[]>(stores);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProductList(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: p.price_note || "Best Price",
              image: p.image_url,
              affiliateUrl: p.affiliate_url,
              note: p.price_note || "Curated for Ceremonial Plates",
            }))
          );
        }
      })
      .catch(() => {});

    api
      .getStores()
      .then((data) => {
        if (data && data.length > 0) {
          setStoreList(
            data.map((s) => ({
              id: s.id,
              name: s.name,
              area: s.area,
              city: s.city,
              specialty: s.speciality,
              discountNote: s.discount_note,
              mapUrl: s.map_url,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? productList
      : productList.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#C88515] uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>DIY Sourcing & Recommendations</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1A2E]">
          Shop the Look & Trusted Stores
        </h1>
        <p className="text-sm sm:text-base text-[#635166] leading-relaxed">
          Prefer to arrange your ceremonial plates yourself? Here are our handpicked tools, trays, and trusted vendors across Tamil Nadu.
        </p>

        <p className="text-[11px] text-[#635166] italic bg-[#FAF5EE] p-3 rounded-xl border border-[#E8DAC8] max-w-xl mx-auto">
          Disclosure: Some product links below are affiliate links. When you purchase through them, we may receive a small commission at no additional cost to you.
        </p>
      </div>

      {/* 1. Curated Products Grid */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8DAC8] pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">
            Recommended Hardware & Essentials
          </h2>

          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Items" },
              { id: "trays", label: "Trays & Fabrics" },
              { id: "tools", label: "Carving Tools" },
              { id: "toppers", label: "Figurines & Toppers" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#2F5D3A] text-white"
                    : "bg-[#FFFDF9] border border-[#E8DAC8] text-[#635166] hover:text-[#2B1A2E]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] overflow-hidden p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF5EE] border border-[#E8DAC8]/60">
                  <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88515]">
                    {prod.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#2B1A2E] mt-0.5 line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#635166] mt-2 line-clamp-2">{prod.note}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F4EDE0] flex items-center justify-between">
                <span className="font-bold text-sm text-[#2F5D3A]">{prod.price}</span>
                <a
                  href={prod.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF3E7] hover:bg-[#E4C580]/40 text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5"
                >
                  <span>Buy Online</span>
                  <ExternalLink className="w-3 h-3 text-[#C88515]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Stores We Trust (Local Partner Directory) */}
      <div className="space-y-8 bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#E8DAC8] shadow-sm">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2F5D3A]">
            Local Partner Discounts
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2B1A2E]">
            Stores We Trust in Tamil Nadu
          </h2>
          <p className="text-xs sm:text-sm text-[#635166]">
            Visit our vetted local bazaar partners in person. Mention BRB Decors at the counter to unlock exclusive courtesy discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storeList.map((st) => (
            <div
              key={st.id}
              className="p-6 rounded-2xl border border-[#E8DAC8] bg-[#FAF5EE] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#2F5D3A] font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {st.area}, {st.city}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">{st.name}</h3>
                <p className="text-xs text-[#635166]">{st.specialty}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E4C580] text-xs font-medium text-[#2B1A2E] flex items-start gap-2">
                  <Tag className="w-4 h-4 text-[#E9A62B] shrink-0 mt-0.5" />
                  <span>{st.discountNote}</span>
                </div>

                <a
                  href={st.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#2F5D3A] hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <span>➔</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
