"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  Grid,
  ShoppingBag,
  Store as StoreIcon,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Send,
  Trash2,
  Plus,
  ExternalLink,
  MessageCircle,
  Sparkles,
  X,
  MapPin,
  Tag,
  AlertCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart3,
  Key,
  Shield,
  Upload,
  UserCheck,
  Check,
} from "lucide-react";
import {
  api,
  ApiBooking,
  ApiGalleryItem,
  ApiProduct,
  ApiStore,
  ApiAvailability,
} from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";

type TabType =
  | "bookings"
  | "payments"
  | "gallery"
  | "analytics"
  | "credentials"
  | "products"
  | "stores"
  | "availability";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bookings");

  // Bookings State
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");
  const [quoteInput, setQuoteInput] = useState<string>("");
  const [quoteNotes, setQuoteNotes] = useState<string>("");

  // Payment State
  const [paymentModalBooking, setPaymentModalBooking] = useState<ApiBooking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");

  // Gallery State
  const [gallery, setGallery] = useState<ApiGalleryItem[]>([]);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    title_tamil: "",
    occasion: "puberty",
    plate_type: "fruits",
    color_theme: "turmeric_gold",
    budget: "signature",
    price: 3500,
    price_range: "₹3,000 – ₹4,500",
    image_url: "/images/decor/sevvazhai_golden_lotus.jpg",
    description: "",
    is_featured: false,
  });

  // Hotspot modal state
  const [hotspotTargetItem, setHotspotTargetItem] = useState<ApiGalleryItem | null>(null);
  const [hotspotCoords, setHotspotCoords] = useState<{ x: number; y: number } | null>(null);
  const [hotspotForm, setHotspotForm] = useState({
    title: "",
    product_name: "",
    affiliate_url: "",
    price_note: "",
  });

  // Products State
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "trays",
    image_url: "/images/decor/vetrilai_mandala_lemon.jpg",
    affiliate_url: "https://amazon.in",
    price_note: "₹1,500 on Amazon",
  });

  // Stores State
  const [stores, setStores] = useState<ApiStore[]>([]);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    area: "",
    city: "Chennai",
    map_url: "https://maps.google.com",
    speciality: "",
    discount_percent: 10,
    discount_note: "Mention BRB Decors for 10% off",
  });

  // Availability State
  const [availability, setAvailability] = useState<ApiAvailability | null>(null);
  const [currentMonth, setCurrentMonth] = useState("2026-10");
  const [blockDateInput, setBlockDateInput] = useState("");
  const [blockReasonInput, setBlockReasonInput] = useState("");
  const [blockAuspicious, setBlockAuspicious] = useState(false);

  // Admin Credentials State
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("admin@brbdecors.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [savingCreds, setSavingCreds] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Initial preload of studio data for instant tab switching
  useEffect(() => {
    api.getBookings().then(setBookings).catch(() => {});
    api.getGallery().then(setGallery).catch(() => {});
    api.getProducts().then(setProducts).catch(() => {});
    api.getStores().then(setStores).catch(() => {});
  }, []);

  // Load active tab data without blocking UI
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadTabData = async (tab: TabType) => {
    // Only show loading if we don't already have data in memory
    const hasData =
      (tab === "bookings" && bookings.length > 0) ||
      (tab === "payments" && bookings.length > 0) ||
      (tab === "analytics" && bookings.length > 0) ||
      (tab === "gallery" && gallery.length > 0) ||
      (tab === "products" && products.length > 0) ||
      (tab === "stores" && stores.length > 0) ||
      (tab === "availability" && availability !== null);

    if (!hasData) {
      setLoading(true);
    }

    try {
      if (tab === "bookings" || tab === "payments" || tab === "analytics") {
        const data = await api.getBookings();
        setBookings(data);
      } else if (tab === "gallery") {
        const data = await api.getGallery();
        setGallery(data);
      } else if (tab === "products") {
        const data = await api.getProducts();
        setProducts(data);
      } else if (tab === "stores") {
        const data = await api.getStores();
        setStores(data);
      } else if (tab === "availability") {
        const data = await api.getAvailability(currentMonth);
        setAvailability(data);
      } else if (tab === "credentials") {
        try {
          const me = await api.getMe();
          if (me.username) setAdminUsername(me.username);
          if (me.email) setAdminEmail(me.email);
        } catch {
          // fallback
        }
      }
    } catch (e: any) {
      console.warn("Could not fetch remote API:", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Status Updater
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(updated);
      }
      showToast(`Booking marked as ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
  };

  // Quote Submitter
  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const amount = parseFloat(quoteInput);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid quote amount in ₹");
      return;
    }
    try {
      const updated = await api.updateBookingQuote(selectedBooking.id, amount, quoteNotes);
      setBookings((prev) => prev.map((b) => (b.id === selectedBooking.id ? updated : b)));
      setSelectedBooking(updated);
      setQuoteInput("");
      setQuoteNotes("");

      // Automatically construct and open formal quote via WhatsApp to the customer
      const advance = Math.round(amount * 0.5);
      const cleanPhone = selectedBooking.phone.replace(/[^0-9]/g, "");
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      const occasionTitle = selectedBooking.occasion
        ? selectedBooking.occasion
            .split("_")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "Ceremony";
      const serviceTitle =
        selectedBooking.service_type === "diy" ? "Decoration Only (Customer supplies items)" : "Full-Service Decoration (All-inclusive)";

      const waMessage = 
`Vanakkam ${selectedBooking.customer_name}! 🙏

Thank you for choosing BRB Decors for your upcoming celebration. Here are your formal quotation details:

📋 *Formal Quotation* (Order Ref: ${selectedBooking.id})
• Ceremony: ${occasionTitle}
• Date: ${selectedBooking.function_date}
• Plate Requirement: ${selectedBooking.plate_count} Arranged Plates (${serviceTitle})
${selectedBooking.plate_types?.length ? `• Plate Varieties: ${selectedBooking.plate_types.join(", ")}\n` : ""}
💰 *Total Quoted Amount*: ₹${amount.toLocaleString("en-IN")}
💵 *50% Advance to Reserve Slot*: ₹${advance.toLocaleString("en-IN")}
💵 *50% Balance on Event Day*: ₹${advance.toLocaleString("en-IN")}
${quoteNotes ? `\n📝 *Artisan Notes*: ${quoteNotes}\n` : ""}
💳 *Payment*: 50% advance secures your auspicious date and decorator materials. Balance is payable on event day at the venue.

You can also view this quote and track your order anytime on our website under 'My Orders'.

Please reply here to confirm your booking or if you need any customizations! ✨
— BRB Decors (8056343769)`;

      const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank");
      showToast(`Formal quote of ₹${amount.toLocaleString("en-IN")} saved & WhatsApp opened!`);
    } catch (err: any) {
      showToast(err.message || "Failed to submit quote");
    }
  };

  // Payment / Deposit Updater
  const handleUpdateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 0) {
      showToast("Please enter a valid deposit amount");
      return;
    }
    try {
      const updated = await api.updateBookingDeposit(paymentModalBooking.id, {
        deposit_paid: true,
        deposit_amount: amount,
        deposit_reference: paymentRef || "UPI / Direct Bank Transfer",
      });
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      if (selectedBooking && selectedBooking.id === updated.id) {
        setSelectedBooking(updated);
      }
      setPaymentModalBooking(null);
      showToast(`Advance deposit of ₹${amount.toLocaleString("en-IN")} recorded!`);
    } catch (err: any) {
      showToast(err.message || "Failed to record payment");
    }
  };

  // Admin Credentials Updater
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword && adminPassword !== adminConfirmPassword) {
      showToast("Passwords do not match");
      return;
    }
    if (adminPassword && adminPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }
    setSavingCreds(true);
    try {
      const payload: any = {};
      if (adminUsername) payload.username = adminUsername;
      if (adminEmail) payload.email = adminEmail;
      if (adminPassword) payload.password = adminPassword;

      await api.updateAdminCredentials(payload);
      setAdminPassword("");
      setAdminConfirmPassword("");
      showToast("Admin credentials updated successfully! You can use these to log in.");
    } catch (err: any) {
      showToast(err.message || "Failed to update credentials");
    } finally {
      setSavingCreds(false);
    }
  };

  // Image Upload handler for Gallery
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.uploadFile(file);
      setNewGalleryItem((prev) => ({ ...prev, image_url: res.url }));
      showToast("Plate decoration photo uploaded!");
    } catch (err: any) {
      showToast(err.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  // Create Gallery Item
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createGalleryItem(newGalleryItem);
      setGallery((prev) => [created, ...prev]);
      setShowAddGalleryModal(false);
      showToast("New ceremonial plate arrangement published!");
    } catch (err: any) {
      showToast(err.message || "Failed to save arrangement");
    }
  };

  // Add Hotspot
  const handleAddHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotspotTargetItem || !hotspotCoords) return;
    try {
      await api.addHotspot(hotspotTargetItem.id, {
        x_percent: hotspotCoords.x,
        y_percent: hotspotCoords.y,
        ...hotspotForm,
      });
      const updated = await api.getGallery();
      setGallery(updated);
      setHotspotTargetItem(null);
      setHotspotCoords(null);
      showToast("Affiliate hotspot pinned to plate photo!");
    } catch (err: any) {
      showToast(err.message || "Failed to pin hotspot");
    }
  };

  // Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createProduct(newProduct);
      setProducts((prev) => [created, ...prev]);
      setShowAddProductModal(false);
      showToast("Affiliate item listed successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to create product");
    }
  };

  // Create Store
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createStore(newStore);
      setStores((prev) => [created, ...prev]);
      setShowAddStoreModal(false);
      showToast("Trusted vendor store registered!");
    } catch (err: any) {
      showToast(err.message || "Failed to create store");
    }
  };

  // Block Date
  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      await api.blockDate({
        date: blockDateInput,
        reason: blockReasonInput || "Blackout / Muhurtham Reserved",
        is_auspicious: blockAuspicious,
      });
      const updated = await api.getAvailability(currentMonth);
      setAvailability(updated);
      setBlockDateInput("");
      setBlockReasonInput("");
      showToast("Date blocked successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to block date");
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== "all" && b.status !== bookingFilter) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      const matchName = b.customer_name?.toLowerCase().includes(q);
      const matchPhone = b.phone?.includes(q);
      const matchId = b.id?.toLowerCase().includes(q);
      const matchCity = b.city?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId && !matchCity) return false;
    }
    return true;
  });

  // Filtered Payments
  const filteredPayments = bookings.filter((b) => {
    if (paymentStatusFilter === "paid") return b.deposit_paid;
    if (paymentStatusFilter === "pending") return !b.deposit_paid;
    return true;
  });

  // Financial calculations
  const totalQuotedValue = bookings.reduce((sum, b) => sum + (b.estimate_amount || 0), 0);
  const totalAdvancesCollected = bookings.reduce((sum, b) => sum + (b.deposit_paid ? (b.deposit_amount || 0) : 0), 0);
  const totalBalanceReceivable = bookings.reduce((sum, b) => {
    if (b.estimate_amount && b.deposit_paid) {
      return sum + Math.max(0, b.estimate_amount - (b.deposit_amount || 0));
    }
    return sum;
  }, 0);
  const pendingAdvancesCount = bookings.filter((b) => !b.deposit_paid && (b.status === "new" || b.status === "quoted")).length;

  // Analytics counts
  const fullServiceCount = bookings.filter((b) => b.service_type === "full_service").length;
  const diyCount = bookings.filter((b) => b.service_type === "diy").length;
  const totalServices = fullServiceCount + diyCount || 1;
  const fullServicePct = Math.round((fullServiceCount / totalServices) * 100);
  const diyPct = 100 - fullServicePct;

  const occasionsCount: Record<string, number> = {};
  bookings.forEach((b) => {
    const occ = b.occasion || "other";
    occasionsCount[occ] = (occasionsCount[occ] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notice */}
      {feedbackMsg && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-[#2F5D3A] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#E9A62B]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8DAC8]">
        {[
          { id: "bookings", label: "Bookings Pipeline", icon: LayoutDashboard },
          { id: "payments", label: "Payment Details", icon: CreditCard },
          { id: "gallery", label: "Decor Works & Plates", icon: Grid },
          { id: "analytics", label: "Business Analytics", icon: BarChart3 },
          { id: "credentials", label: "Admin Credentials", icon: Key },
          { id: "products", label: "Affiliate Products", icon: ShoppingBag },
          { id: "stores", label: "Trusted Stores", icon: StoreIcon },
          { id: "availability", label: "Availability Calendar", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#2F5D3A] text-white shadow-sm"
                  : "bg-[#FFFDF9] text-[#635166] hover:bg-[#FAF3E7] border border-[#E8DAC8]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#E9A62B]" : "text-[#635166]"}`} />
              <span>{tab.label}</span>
              {tab.id === "bookings" && bookings.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                  {bookings.length}
                </span>
              )}
              {tab.id === "payments" && pendingAdvancesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E9A62B] text-[#2B1A2E] font-bold">
                  {pendingAdvancesCount} pending
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS PIPELINE */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Total Inquiries", count: bookings.length, color: "text-[#2B1A2E]" },
              { label: "New Requests", count: bookings.filter((b) => b.status === "new").length, color: "text-[#E9A62B]" },
              { label: "Formal Quoted", count: bookings.filter((b) => b.status === "quoted").length, color: "text-blue-600" },
              { label: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length, color: "text-[#2F5D3A]" },
              { label: "Completed", count: bookings.filter((b) => b.status === "completed").length, color: "text-emerald-700" },
            ].map((metric, i) => (
              <div key={i} className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E8DAC8] shadow-2xs">
                <span className="text-[11px] font-semibold text-[#635166] block">{metric.label}</span>
                <span className={`text-2xl font-bold font-serif ${metric.color}`}>{metric.count}</span>
              </div>
            ))}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E8DAC8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#635166] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone, city, ID..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {["all", "new", "quoted", "confirmed", "completed", "cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    bookingFilter === st
                      ? "bg-[#2F5D3A] text-white"
                      : "bg-[#FAF3E7] text-[#635166] hover:bg-[#E8DAC8]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <div className="p-12 text-center text-xs text-[#635166]">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] text-xs text-[#635166]">
              No bookings match the filter criteria.
            </div>
          ) : (
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF3E7] border-b border-[#E8DAC8] text-[#635166] uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Date & City</th>
                      <th className="py-3 px-4">Occasion & Plates</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Deposit</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DAC8]/60">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF3E7]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2B1A2E]">{b.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#2B1A2E] block">{b.customer_name}</span>
                          <span className="text-[#635166] text-[11px]">{b.phone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#2F5D3A] block">{b.function_date}</span>
                          <span className="text-[#635166] text-[11px]">{b.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="capitalize font-semibold text-[#2B1A2E] block">{b.occasion}</span>
                          <span className="text-[#635166] text-[11px]">{b.plate_count} Plates</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.service_type === "diy"
                                ? "bg-[#C88515]/10 text-[#C88515]"
                                : "bg-[#2F5D3A]/10 text-[#2F5D3A]"
                            }`}
                          >
                            {b.service_type === "diy" ? "Decoration Only" : "Full-Service"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === "confirmed"
                                ? "bg-[#2F5D3A] text-white"
                                : b.status === "quoted"
                                ? "bg-blue-600 text-white"
                                : b.status === "completed"
                                ? "bg-emerald-700 text-white"
                                : b.status === "cancelled"
                                ? "bg-[#A8232F] text-white"
                                : "bg-[#E9A62B] text-[#2B1A2E]"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {b.deposit_paid ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>₹{b.deposit_amount?.toLocaleString("en-IN") || "Paid"}</span>
                            </span>
                          ) : (
                            <span className="text-[#E9A62B] font-semibold text-[11px]">Pending</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-3 py-1.5 rounded-xl bg-[#2F5D3A] text-white font-semibold hover:bg-[#214229] transition-colors"
                            >
                              Manage
                            </button>
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Vanakkam ${b.customer_name}! This is BRB Decors regarding your ceremonial plate inquiry (${b.id}) for ${b.occasion} on ${b.function_date}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete inquiry ${b.id}?`)) {
                                  await api.deleteBooking(b.id);
                                  setBookings((prev) => prev.filter((item) => item.id !== b.id));
                                  showToast("Booking deleted");
                                }
                              }}
                              className="p-1.5 rounded-xl bg-red-50 text-[#A8232F] hover:bg-red-100 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT DETAILS */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          {/* Payment Financial KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DAC8] shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#635166] uppercase tracking-wider block">
                Total Pipeline Quoted
              </span>
              <span className="font-serif text-2xl font-bold text-[#2B1A2E]">
                ₹{totalQuotedValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#635166] block">Across all formal quotes</span>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#2F5D3A]/30 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#2F5D3A] uppercase tracking-wider block">
                50% Advance Received
              </span>
              <span className="font-serif text-2xl font-bold text-[#2F5D3A]">
                ₹{totalAdvancesCollected.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#2F5D3A] block">Deposits locked in bank / UPI</span>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E4C580] shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#976008] uppercase tracking-wider block">
                Event Day Balance Due
              </span>
              <span className="font-serif text-2xl font-bold text-[#2B1A2E]">
                ₹{totalBalanceReceivable.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#635166] block">Payable at mandapam on setup</span>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DAC8] shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#E9A62B] uppercase tracking-wider block">
                Pending Advance Requests
              </span>
              <span className="font-serif text-2xl font-bold text-[#E9A62B]">
                {pendingAdvancesCount}
              </span>
              <span className="text-[10px] text-[#635166] block">Awaiting client advance transfer</span>
            </div>
          </div>

          {/* Payment Filter Bar */}
          <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E8DAC8] flex items-center justify-between">
            <span className="font-serif font-bold text-base text-[#2B1A2E]">Payment Records</span>
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "All Orders" },
                { id: "paid", label: "Advance Paid (Confirmed)" },
                { id: "pending", label: "Pending Advance" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPaymentStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    paymentStatusFilter === f.id
                      ? "bg-[#2F5D3A] text-white"
                      : "bg-[#FAF3E7] text-[#635166] hover:bg-[#E8DAC8]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF3E7] border-b border-[#E8DAC8] text-[#635166] uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Booking</th>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Function Date</th>
                    <th className="py-3 px-4">Service Type</th>
                    <th className="py-3 px-4">Quoted Total</th>
                    <th className="py-3 px-4">50% Advance</th>
                    <th className="py-3 px-4">50% Balance</th>
                    <th className="py-3 px-4">Status & Ref</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DAC8]/60">
                  {filteredPayments.map((b) => {
                    const quote = b.estimate_amount || 0;
                    const halfQuote = Math.round(quote * 0.5);
                    return (
                      <tr key={b.id} className="hover:bg-[#FAF3E7]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#2B1A2E] block">{b.id}</span>
                          <span className="capitalize text-[#635166] text-[11px]">{b.occasion}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#2B1A2E] block">{b.customer_name}</span>
                          <span className="text-[#635166] text-[11px]">{b.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#2F5D3A]">{b.function_date}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.service_type === "diy"
                                ? "bg-[#C88515]/10 text-[#C88515]"
                                : "bg-[#2F5D3A]/10 text-[#2F5D3A]"
                            }`}
                          >
                            {b.service_type === "diy" ? "Decoration Only" : "Full-Service"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#2B1A2E]">
                          {quote > 0 ? `₹${quote.toLocaleString("en-IN")}` : "Unquoted"}
                        </td>
                        <td className="py-3.5 px-4 text-[#2F5D3A] font-semibold">
                          {quote > 0 ? `₹${halfQuote.toLocaleString("en-IN")}` : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-[#635166] font-semibold">
                          {quote > 0 ? `₹${halfQuote.toLocaleString("en-IN")}` : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          {b.deposit_paid ? (
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Advance Received
                              </span>
                              <span className="block text-[10px] text-[#635166] mt-0.5 font-mono">
                                {b.deposit_reference || "Direct Transfer"} (₹{b.deposit_amount?.toLocaleString("en-IN")})
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                              Pending Advance
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setPaymentModalBooking(b);
                              setPaymentAmount(String(b.deposit_amount || halfQuote || 2000));
                              setPaymentRef(b.deposit_reference || "");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#2F5D3A] text-white font-semibold hover:bg-[#214229] transition-colors"
                          >
                            {b.deposit_paid ? "Update Payment" : "Record Advance"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GALLERY & DECORATION WORKS */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Ceremonial Plate Gallery & Decors</h2>
              <p className="text-xs text-[#635166]">
                Add or delete your handcrafted decorative plates (thaalams), customize prices and tag hotspot affiliate items.
              </p>
            </div>
            <button
              onClick={() => setShowAddGalleryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold shadow-xs hover:bg-[#214229] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#E9A62B]" />
              <span>Add New Decoration Work</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] overflow-hidden shadow-2xs space-y-3 p-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF3E7]">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                    {/* Price tag badge */}
                    <div className="absolute top-3 left-3 bg-[#2F5D3A] text-white px-2.5 py-1 rounded-full text-xs font-serif font-bold shadow-md border border-[#E4C580]">
                      {item.price ? `₹${item.price.toLocaleString("en-IN")}` : item.price_range || "Custom"}
                    </div>
                    {/* Hotspots preview overlay */}
                    {item.hotspots?.map((hs, i) => (
                      <div
                        key={i}
                        className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E9A62B] border-2 border-white shadow-lg flex items-center justify-center animate-pulse"
                        style={{ left: `${hs.x_percent}%`, top: `${hs.y_percent}%` }}
                        title={`${hs.title}: ${hs.product_name}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#E9A62B]">
                      <span>{item.occasion} • {item.plate_type}</span>
                      {item.price_range && <span className="text-[#2F5D3A] font-semibold">{item.price_range}</span>}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#2B1A2E] leading-snug">{item.title}</h3>
                    {item.title_tamil && (
                      <p className="text-[11px] font-medium text-[#2F5D3A]">{item.title_tamil}</p>
                    )}
                    <p className="text-xs text-[#635166] line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-[#E8DAC8]">
                  <button
                    onClick={() => setHotspotTargetItem(item)}
                    className="text-xs font-semibold text-[#2F5D3A] hover:underline flex items-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Tag Hotspots ({item.hotspots?.length || 0})</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                        await api.deleteGalleryItem(item.id);
                        setGallery((prev) => prev.filter((g) => g.id !== item.id));
                        showToast("Arrangement removed from website");
                      }
                    }}
                    className="text-xs text-[#A8232F] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BUSINESS ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Studio Business Intelligence</h2>
              <p className="text-xs text-[#635166]">
                Analytics on inquiry conversion, service preference ratio, and occasion trends.
              </p>
            </div>
          </div>

          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E8DAC8] shadow-2xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#635166] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#2F5D3A]" />
                <span>Conversion Pipeline</span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Total Inquiries Received</span>
                  <span className="font-bold text-[#2B1A2E]">{bookings.length}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Formal Quotes Sent</span>
                  <span className="font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "quoted" || b.status === "confirmed" || b.status === "completed").length}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Deposits Confirmed</span>
                  <span className="font-bold text-[#2F5D3A]">
                    {bookings.filter((b) => b.deposit_paid).length}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E8DAC8]/60 flex justify-between font-serif font-bold text-sm">
                  <span>Conversion Ratio</span>
                  <span className="text-[#2F5D3A]">
                    {bookings.length > 0
                      ? `${Math.round((bookings.filter((b) => b.deposit_paid).length / bookings.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Type Distribution */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E8DAC8] shadow-2xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#635166] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#E9A62B]" />
                <span>Service Type Breakdown</span>
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#2F5D3A]">Full-Service Decoration</span>
                    <span>{fullServiceCount} ({fullServicePct}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#FAF3E7] overflow-hidden">
                    <div className="h-full bg-[#2F5D3A] rounded-full transition-all" style={{ width: `${fullServicePct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#C88515]">Decoration Only (Customer Items)</span>
                    <span>{diyCount} ({diyPct}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#FAF3E7] overflow-hidden">
                    <div className="h-full bg-[#C88515] rounded-full transition-all" style={{ width: `${diyPct}%` }} />
                  </div>
                </div>
                <p className="text-[11px] text-[#635166] pt-1">
                  💡 Customers choosing <strong>Decoration Only</strong> are guided to <em>&apos;Shop the Look&apos;</em> in Steps 3 and 6 to source items.
                </p>
              </div>
            </div>

            {/* Popular Occasions */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E8DAC8] shadow-2xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#635166] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#A8232F]" />
                <span>Ceremony Occasions</span>
              </span>
              <div className="space-y-1.5 text-xs">
                {Object.entries(occasionsCount).map(([occ, cnt]) => (
                  <div key={occ} className="flex justify-between py-1 border-b border-[#E8DAC8]/40">
                    <span className="capitalize font-semibold text-[#2B1A2E]">{occ.replace("_", " ")}</span>
                    <span className="font-bold text-[#2F5D3A]">{cnt} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN CREDENTIALS SETTING */}
      {activeTab === "credentials" && (
        <div className="max-w-2xl bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex items-center gap-3 border-b border-[#E8DAC8] pb-4">
            <div className="w-12 h-12 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center border border-[#E9A62B]">
              <Key className="w-6 h-6 text-[#E9A62B]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Admin Credentials Manager</h2>
              <p className="text-xs text-[#635166]">
                As the website creator, you can set or change the admin username and password here at any time.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#2B1A2E] block">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
              />
              <span className="text-[10px] text-[#635166]">You can log in at /admin/login using this username.</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B1A2E] block">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B1A2E] block">New Password (leave empty to keep current)</label>
              <input
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
              />
            </div>

            {adminPassword && (
              <div className="space-y-1">
                <label className="font-semibold text-[#2B1A2E] block">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={savingCreds}
              className="w-full py-3 rounded-full bg-[#2F5D3A] text-white font-semibold hover:bg-[#214229] transition-colors shadow-xs"
            >
              {savingCreds ? "Updating Credentials..." : "Save Admin Credentials"}
            </button>
          </form>

          {/* Developer CLI Guide */}
          <div className="p-4 rounded-2xl bg-[#2F5D3A]/5 border border-[#2F5D3A]/15 space-y-2 text-xs">
            <span className="font-bold text-[#2F5D3A] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Alternative Terminal Setup for Creator:</span>
            </span>
            <p className="text-[#635166] leading-relaxed">
              You can also set or reset credentials directly via terminal using the helper script:
            </p>
            <code className="block p-2.5 rounded-xl bg-[#2B1A2E] text-[#E4C580] font-mono text-[11px] overflow-x-auto">
              python scripts/set_admin.py --username admin --password &quot;YourPassword&quot;
            </code>
          </div>
        </div>
      )}

      {/* TAB 6: AFFILIATE PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Affiliate Products Catalog</h2>
              <p className="text-xs text-[#635166]">Curate DIY tools, brass trays and toppers with affiliate links.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold shadow-xs hover:bg-[#214229] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#E9A62B]" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className="bg-[#FFFDF9] rounded-2xl border border-[#E8DAC8] p-4 space-y-3 shadow-2xs">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF3E7]">
                  <Image src={prod.image_url} alt={prod.name} fill className="object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9A62B]">{prod.category}</span>
                  <h4 className="font-serif font-bold text-sm text-[#2B1A2E]">{prod.name}</h4>
                  <p className="text-xs text-[#2F5D3A] font-semibold">{prod.price_note || "Affiliate Link"}</p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#E8DAC8]">
                  <a
                    href={prod.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2F5D3A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={async () => {
                      if (confirm("Delete product?")) {
                        await api.deleteProduct(prod.id);
                        setProducts((prev) => prev.filter((p) => p.id !== prod.id));
                        showToast("Product deleted");
                      }
                    }}
                    className="text-xs text-[#A8232F] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: TRUSTED STORES */}
      {activeTab === "stores" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Trusted Local Partner Stores</h2>
              <p className="text-xs text-[#635166]">Partner brass & decor stores in Chennai, Madurai & Coimbatore.</p>
            </div>
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold shadow-xs hover:bg-[#214229] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#E9A62B]" />
              <span>Add Partner Store</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div key={store.id} className="bg-[#FFFDF9] rounded-2xl border border-[#E8DAC8] p-5 space-y-3 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2B1A2E]">{store.name}</h4>
                    <span className="text-xs text-[#635166] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E9A62B]" />
                      <span>{store.area}, {store.city}</span>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#2F5D3A]/10 text-[#2F5D3A] font-bold text-xs">
                    {store.discount_percent}% OFF
                  </span>
                </div>
                <p className="text-xs text-[#635166]">{store.speciality}</p>
                <div className="p-2.5 rounded-xl bg-[#FAF3E7] text-[11px] font-semibold text-[#8B5E14]">
                  {store.discount_note}
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#E8DAC8]">
                  <a
                    href={store.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2F5D3A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={async () => {
                      if (confirm("Delete store?")) {
                        await api.deleteStore(store.id);
                        setStores((prev) => prev.filter((s) => s.id !== store.id));
                        showToast("Store removed");
                      }
                    }}
                    className="text-xs text-[#A8232F] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AVAILABILITY CALENDAR */}
      {activeTab === "availability" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">Availability & Muhurtham Dates</h2>
              <p className="text-xs text-[#635166]">Block dates or mark auspicious Muhurtham days on the customer calendar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleBlockDate} className="bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-base text-[#2B1A2E]">Block or Reserve a Date</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={blockDateInput}
                    onChange={(e) => setBlockDateInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Reason / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Fully Booked for Grand Wedding"
                    value={blockReasonInput}
                    onChange={(e) => setBlockReasonInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="auspicious-check"
                    checked={blockAuspicious}
                    onChange={(e) => setBlockAuspicious(e.target.checked)}
                    className="rounded text-[#2F5D3A]"
                  />
                  <label htmlFor="auspicious-check" className="font-semibold cursor-pointer">
                    Flag as Subha Muhurtham Day
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors"
              >
                Block Date
              </button>
            </form>

            <div className="lg:col-span-2 bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-base text-[#2B1A2E]">Active Blackout & Muhurtham Dates</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {availability?.blocked_dates?.map((bd) => (
                  <div key={bd.id} className="p-3 rounded-2xl bg-[#FAF3E7] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#2B1A2E] mr-2">{bd.date}</span>
                      <span className="text-[#635166]">{bd.reason}</span>
                      {bd.is_auspicious && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E9A62B]/20 text-[#8B5E14] text-[10px] font-bold">
                          Subha Muhurtham
                        </span>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        await api.unblockDate(bd.id);
                        const updated = await api.getAvailability(currentMonth);
                        setAvailability(updated);
                        showToast("Date unblocked");
                      }}
                      className="text-xs text-[#A8232F] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BOOKING DETAILS & QUOTE */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#E8DAC8] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E9A62B]">
                  {selectedBooking.id}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2B1A2E]">
                  {selectedBooking.customer_name}
                </h2>
                <span className="text-xs text-[#635166]">{selectedBooking.phone} • {selectedBooking.email || "No email"}</span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#635166] hover:text-[#2B1A2E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ceremony Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF3E7] text-xs">
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Function Date</span>
                <span className="font-semibold text-[#2B1A2E]">{selectedBooking.function_date}</span>
              </div>
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Occasion</span>
                <span className="font-semibold text-[#2B1A2E] capitalize">{selectedBooking.occasion}</span>
              </div>
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Plates Count</span>
                <span className="font-semibold text-[#2F5D3A]">{selectedBooking.plate_count} Decorative Thaalams</span>
              </div>
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Service Model</span>
                <span className="font-semibold text-[#2B1A2E]">
                  {selectedBooking.service_type === "diy" ? "Decoration Only (Customer Items)" : "Full-Service Decoration"}
                </span>
              </div>
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Venue / City</span>
                <span className="font-semibold text-[#2B1A2E]">
                  {selectedBooking.venue ? `${selectedBooking.venue}, ` : ""}{selectedBooking.city}
                </span>
              </div>
              <div>
                <span className="text-[#635166] block text-[10px] uppercase font-bold">Stage Decor</span>
                <span className="font-semibold text-[#2B1A2E]">{selectedBooking.stage_required ? "Yes (Stage Included)" : "No"}</span>
              </div>
            </div>

            {/* Plate Types */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-[#2B1A2E] block">Configured Plate Types:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedBooking.plate_types?.map((pt) => (
                  <span key={pt} className="px-2.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-[#2F5D3A] font-semibold text-[11px] capitalize">
                    {pt.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Inspiration Photos */}
            {selectedBooking.inspirations && selectedBooking.inspirations.length > 0 && (
              <div className="space-y-2">
                <span className="font-semibold text-xs text-[#2B1A2E] block">Client Inspiration Photos:</span>
                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {selectedBooking.inspirations.map((insp, i) => (
                    <a
                      key={i}
                      href={insp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-20 h-20 rounded-xl overflow-hidden border border-[#E8DAC8] bg-[#FAF5EE] shrink-0 block relative group text-center"
                      title={insp.preview_title || `Inspiration #${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={insp.url}
                        alt={insp.preview_title || "Inspiration"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector(".fallback-label")) {
                            const d = document.createElement("div");
                            d.className = "fallback-label w-full h-full flex flex-col items-center justify-center p-1 text-[10px] text-[#2F5D3A] font-semibold";
                            d.innerHTML = "🌸 <span>Inspiration</span>";
                            parent.appendChild(d);
                          }
                        }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedBooking.notes && (
              <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DAC8] text-xs">
                <span className="font-semibold text-[#2B1A2E] block mb-1">Customer / Quote Notes:</span>
                <p className="text-[#635166] whitespace-pre-wrap">{selectedBooking.notes}</p>
              </div>
            )}

            {/* Formal Quote Submitter */}
            <form onSubmit={handleSendQuote} className="p-4 rounded-2xl bg-[#FAF3E7] border border-[#E8DAC8] space-y-3">
              <span className="font-serif font-bold text-sm text-[#2B1A2E] block">Formal Price Quote</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Quote Total (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 18500"
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-white font-semibold text-sm"
                  />
                  {selectedBooking.estimate_amount && (
                    <span className="text-[10px] text-[#2F5D3A] font-semibold block mt-1">
                      Current: ₹{selectedBooking.estimate_amount.toLocaleString("en-IN")} (50% Advance = ₹{(selectedBooking.estimate_amount * 0.5).toLocaleString("en-IN")})
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-semibold block mb-1">Artisan Notes / Breakdown</label>
                  <input
                    type="text"
                    placeholder="e.g. Includes red bananas & fresh jasmine"
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-white text-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-[#635166] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#2F5D3A]" />
                  <span>Submitting saves the quote & opens WhatsApp to <strong>{selectedBooking.phone}</strong></span>
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#E9A62B]" />
                  <span>Send Formal Quote & WhatsApp</span>
                </button>
              </div>
            </form>

            {/* Status Update Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8DAC8]">
              <span className="text-[11px] font-semibold text-[#635166] mr-2">Update Pipeline Status:</span>
              {(["new", "quoted", "confirmed", "completed", "cancelled"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${
                    selectedBooking.status === st
                      ? "bg-[#2F5D3A] text-white"
                      : "bg-[#FAF3E7] text-[#635166] hover:bg-[#E8DAC8]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECORD / UPDATE PAYMENT */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateDeposit}
            className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8DAC8] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#E9A62B] font-bold">
                  {paymentModalBooking.id}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">
                  Record Advance Deposit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalBooking(null)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#635166]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF3E7] text-xs space-y-1">
              <span className="font-semibold text-[#2B1A2E] block">{paymentModalBooking.customer_name}</span>
              <span className="text-[#635166] block">
                {paymentModalBooking.occasion} • {paymentModalBooking.function_date}
              </span>
              {paymentModalBooking.estimate_amount && (
                <span className="text-[#2F5D3A] font-bold block pt-1">
                  Full Quote: ₹{paymentModalBooking.estimate_amount.toLocaleString("en-IN")} | 50% Target: ₹{(paymentModalBooking.estimate_amount * 0.5).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#2B1A2E] block mb-1">
                  Advance Amount Received (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B1A2E] block mb-1">
                  Payment Reference / Mode
                </label>
                <input
                  type="text"
                  placeholder="e.g. GPay UPI 6291829 or Cash at Studio"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors shadow-xs"
            >
              Confirm & Save Payment
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD GALLERY ITEM WITH PRICE & UPLOAD */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGalleryItem}
            className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8DAC8] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">Publish Ceremonial Arrangement</h3>
                <p className="text-xs text-[#635166]">Set photos, price, occasion and customization details.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Arrangement Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Sevvazhai & Golden Lotus Thaalam"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Title in Tamil (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. பொன் தாமரை & அலங்கார செவ்வாழைத் தட்டு"
                  value={newGalleryItem.title_tamil}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title_tamil: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>

              {/* Price & Price Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Starting Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={newGalleryItem.price}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Display Price Note / Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3,000 – ₹4,500"
                    value={newGalleryItem.price_range}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, price_range: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Ceremony Occasion</label>
                  <select
                    value={newGalleryItem.occasion}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, occasion: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  >
                    <option value="puberty">Puberty (Manjal Neerattu Vizha)</option>
                    <option value="wedding">Wedding Seer Varisai</option>
                    <option value="baby_shower">Baby Shower (Valaikappu)</option>
                    <option value="housewarming">Housewarming (Grihapravesam)</option>
                    <option value="birthday">Milestone Birthday / Sashtiabdapoorthi</option>
                    <option value="festivals">Auspicious Festivals</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Plate Type</label>
                  <select
                    value={newGalleryItem.plate_type}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, plate_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  >
                    <option value="fruits">Fruits & Leaf Carving</option>
                    <option value="flowers">Floral Arrangement</option>
                    <option value="sweets_dryfruits">Sweets & Dry Fruits</option>
                    <option value="deity">Deity / Kalasam Plate</option>
                    <option value="baby_theme">Baby Theme Topper</option>
                    <option value="stage_backdrop">Stage Backdrop</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="font-semibold block mb-1">Plate Photo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newGalleryItem.image_url}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image_url: e.target.value })}
                    placeholder="/images/decor/..."
                    className="flex-1 p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-[#2F5D3A] text-white font-semibold cursor-pointer hover:bg-[#214229] transition-colors flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description & Artisan Customization</label>
                <textarea
                  rows={2}
                  placeholder="Materials used, auspicious leaves, flower varieties, customization notes..."
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={newGalleryItem.is_featured}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, is_featured: e.target.checked })}
                  className="rounded text-[#2F5D3A]"
                />
                <label htmlFor="featured-check" className="font-semibold cursor-pointer">
                  Feature this plate on website homepage
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors shadow-xs"
            >
              Save & Publish to Gallery
            </button>
          </form>
        </div>
      )}

      {/* MODAL: INTERACTIVE HOTSPOT PINNER */}
      {hotspotTargetItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8DAC8] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">Hotspot Coordinate Pinner</h3>
                <p className="text-xs text-[#635166]">Click anywhere on the plate to place an affiliate hotspot.</p>
              </div>
              <button
                onClick={() => setHotspotTargetItem(null)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clickable Image Canvas */}
            <div
              className="relative aspect-video sm:aspect-square max-h-80 mx-auto rounded-2xl overflow-hidden cursor-crosshair border border-[#E8DAC8]"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                setHotspotCoords({ x, y });
              }}
            >
              <Image src={hotspotTargetItem.image_url} alt={hotspotTargetItem.title} fill className="object-cover" />
              {hotspotCoords && (
                <div
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E9A62B] border-2 border-white shadow-xl flex items-center justify-center animate-bounce"
                  style={{ left: `${hotspotCoords.x}%`, top: `${hotspotCoords.y}%` }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#2F5D3A]" />
                </div>
              )}
            </div>

            {hotspotCoords ? (
              <form onSubmit={handleAddHotspot} className="space-y-3 bg-[#FAF3E7] p-4 rounded-2xl border border-[#E8DAC8]">
                <div className="text-xs font-semibold text-[#2F5D3A]">
                  Pinned Coordinate: {hotspotCoords.x}% X, {hotspotCoords.y}% Y
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Hotspot Title (e.g. Carved Crown)"
                    value={hotspotForm.title}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, title: e.target.value })}
                    required
                    className="p-2 rounded-xl bg-white border border-[#E8DAC8]"
                  />
                  <input
                    type="text"
                    placeholder="Product Name (e.g. Fruit Carving Tool Set)"
                    value={hotspotForm.product_name}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, product_name: e.target.value })}
                    required
                    className="p-2 rounded-xl bg-white border border-[#E8DAC8]"
                  />
                  <input
                    type="url"
                    placeholder="Affiliate URL (https://amazon.in/...)"
                    value={hotspotForm.affiliate_url}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, affiliate_url: e.target.value })}
                    required
                    className="p-2 rounded-xl bg-white border border-[#E8DAC8]"
                  />
                  <input
                    type="text"
                    placeholder="Price Note (e.g. ₹450 on Amazon)"
                    value={hotspotForm.price_note}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, price_note: e.target.value })}
                    className="p-2 rounded-xl bg-white border border-[#E8DAC8]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors"
                >
                  Pin This Affiliate Product
                </button>
              </form>
            ) : (
              <p className="text-center text-xs text-[#635166] italic">Click on the image above to choose hotspot position.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProduct}
            className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8DAC8] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">Add Affiliate Product</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                >
                  <option value="trays">Traditional Brass & Silver Trays</option>
                  <option value="tools">Artisan Carving & Styling Tools</option>
                  <option value="toppers">Deity & Ceremonial Figurines</option>
                  <option value="decor">Embellishments & Beads</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Affiliate URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.affiliate_url}
                  onChange={(e) => setNewProduct({ ...newProduct, affiliate_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Price Note</label>
                <input
                  type="text"
                  value={newProduct.price_note}
                  onChange={(e) => setNewProduct({ ...newProduct, price_note: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors"
            >
              List Product
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD STORE */}
      {showAddStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStore}
            className="bg-[#FFFDF9] rounded-3xl border-2 border-[#E8DAC8] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8DAC8] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2B1A2E]">Register Partner Store</h3>
              <button
                type="button"
                onClick={() => setShowAddStoreModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF3E7] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Area</label>
                  <input
                    type="text"
                    required
                    value={newStore.area}
                    onChange={(e) => setNewStore({ ...newStore, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newStore.city}
                    onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Speciality</label>
                <input
                  type="text"
                  required
                  value={newStore.speciality}
                  onChange={(e) => setNewStore({ ...newStore, speciality: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newStore.discount_percent}
                    onChange={(e) => setNewStore({ ...newStore, discount_percent: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Discount Note</label>
                  <input
                    type="text"
                    value={newStore.discount_note}
                    onChange={(e) => setNewStore({ ...newStore, discount_note: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7]"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors"
            >
              Register Partner Store
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
