"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  RefreshCw,
  X,
  Phone,
  Layers,
} from "lucide-react";
import { api, ApiBooking, getCustomerUser, getCustomerOrderIds } from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cancellation Modal state
  const [cancellingOrder, setCancellingOrder] = useState<ApiBooking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingInProgress, setCancellingInProgress] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOrders = async (phoneFilter?: string) => {
    setLoading(true);
    try {
      const user = getCustomerUser();
      const storedIds = getCustomerOrderIds();

      const fetched = await api.getMyOrders({
        email: user?.email,
        phone: phoneFilter || user?.phone,
        orderIds: storedIds,
      });

      setOrders(fetched);
    } catch (err) {
      console.warn("Could not fetch remote orders, falling back to local storage:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSearchByPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;
    setSearching(true);
    try {
      const results = await api.getMyOrders({
        phone: searchPhone.trim(),
        orderIds: [searchPhone.trim().toUpperCase()],
      });
      if (results.length > 0) {
        // Merge with existing
        const map = new Map<string, ApiBooking>();
        orders.forEach((o) => map.set(o.id, o));
        results.forEach((o) => map.set(o.id, o));
        setOrders(Array.from(map.values()));
        showToast(`Found ${results.length} order(s) for ${searchPhone}`);
      } else {
        showToast("No orders found with that phone or reference number.");
      }
    } catch {
      showToast("Could not lookup orders right now. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setCancellingInProgress(true);
    try {
      const updated = await api.cancelBooking(cancellingOrder.id, cancelReason);
      setOrders((prev) => prev.map((o) => (o.id === cancellingOrder.id ? { ...o, status: "cancelled" } : o)));
      showToast(`Order ${cancellingOrder.id} has been cancelled successfully.`);
      setCancellingOrder(null);
      setCancelReason("");
    } catch (err: any) {
      showToast(err.message || "Failed to cancel order");
    } finally {
      setCancellingInProgress(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: ApiBooking["status"]) => {
    switch (status) {
      case "quoted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Formal Quote Ready! 🎉</span>
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Booking Confirmed</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Ceremony Completed</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-300 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled</span>
          </span>
        );
      case "new":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Artisan Review</span>
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.occasion.toLowerCase().includes(q) ||
      (o.function_date && o.function_date.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#2B1A2E] text-white text-xs font-semibold shadow-2xl border border-[#E9A62B] animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DAC8] text-xs font-semibold text-[#2F5D3A] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E9A62B]" />
          <span>Ceremonial Orders & Quotations</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B1A2E]">
          My Orders
        </h1>
        <p className="text-sm sm:text-base text-[#635166]">
          Track your plate decoration requests, review formal quotes sent by the decorators, and manage your ceremony plans.
        </p>
      </div>

      {/* Quick Lookup Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="font-serif font-bold text-base text-[#2B1A2E] block">
            Looking for an order placed earlier?
          </span>
          <span className="text-xs text-[#635166]">
            Enter your WhatsApp Phone Number or Booking Reference ID (e.g. BRB-2026-XXXX).
          </span>
        </div>

        <form onSubmit={handleSearchByPhone} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. 8056343769 or BRB-2026-..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-[#E8DAC8] bg-[#FAF5EE] text-xs text-[#2B1A2E] w-full md:w-64 focus:outline-none focus:border-[#2F5D3A]"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 rounded-full bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors shrink-0 disabled:opacity-50"
          >
            {searching ? "Searching..." : "Find"}
          </button>
        </form>
      </div>

      {/* Search and Refresh Filter */}
      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#635166] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by occasion, date, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-xs text-[#2B1A2E]"
            />
          </div>

          <button
            onClick={() => loadOrders()}
            className="inline-flex items-center gap-1.5 text-xs text-[#635166] hover:text-[#2F5D3A] self-end sm:self-auto font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>
      )}

      {/* Orders List Area */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#2F5D3A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#635166] font-medium">Retrieving your ceremonial orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-3xl bg-[#FFFDF9] border border-[#E8DAC8] space-y-6 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF3E7] border-2 border-[#E4C580] flex items-center justify-center mx-auto text-[#2F5D3A]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#2B1A2E]">
              No Ceremonial Orders Found
            </h3>
            <p className="text-xs text-[#635166] leading-relaxed">
              You haven&apos;t placed any plate decoration requests yet. Use our interactive Plate Planner to create your custom thaalam arrangement.
            </p>
          </div>
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-bold hover:bg-[#214229] transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#E9A62B]" />
            <span>Plan Your Ceremonial Plate Set</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const hasFormalQuote = Boolean(order.estimate_amount && order.estimate_amount > 0);
            const advanceAmount = hasFormalQuote ? Math.round((order.estimate_amount || 0) * 0.5) : 0;
            const balanceAmount = hasFormalQuote ? Math.round((order.estimate_amount || 0) * 0.5) : 0;
            const canCancel = order.status !== "cancelled" && order.status !== "completed";

            const waInquiryMessage = encodeURIComponent(
              `Vanakkam BRB Decors! Regarding my ceremonial order *${order.id}* (${order.occasion.replace("_", " ")} on ${order.function_date}):\n` +
              (hasFormalQuote ? `I have reviewed the formal quote of ₹${order.estimate_amount?.toLocaleString("en-IN")}. I would like to discuss the 50% advance confirmation.` : `Could you please update me on the quotation status?`)
            );

            return (
              <div
                key={order.id}
                className="bg-[#FFFDF9] rounded-3xl border border-[#E8DAC8] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Decorative Top Accent Stripe based on status */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    order.status === "quoted"
                      ? "bg-emerald-500"
                      : order.status === "confirmed"
                      ? "bg-blue-500"
                      : order.status === "cancelled"
                      ? "bg-red-400"
                      : "bg-[#E9A62B]"
                  }`}
                />

                {/* Card Top: Order ID, Date Placed & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DAC8]/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-[#2B1A2E] bg-[#FAF3E7] px-3 py-1 rounded-full border border-[#E8DAC8]">
                        Order #{order.id}
                      </span>
                      {renderStatusBadge(order.status)}
                    </div>
                    <span className="text-[11px] text-[#635166] block">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* WhatsApp Quick Chat */}
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waInquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2F5D3A] text-[#2F5D3A] hover:bg-[#2F5D3A]/5 text-xs font-semibold transition-colors shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#2F5D3A]" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* FORMAL QUOTE SPOTLIGHT BANNER (When Admin has quoted) */}
                {hasFormalQuote && order.status !== "cancelled" && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF3E7] border-2 border-[#E4C580] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#E9A62B]" />
                        <span className="font-serif font-bold text-base text-[#2B1A2E]">
                          Formal Quotation Received
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#2F5D3A] bg-white px-2.5 py-1 rounded-full border border-[#2F5D3A]/30">
                        {order.status === "confirmed" ? "Deposit Recorded ✓" : "Awaiting 50% Advance"}
                      </span>
                    </div>

                    {/* Price Breakdown Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-[#E8DAC8]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#635166] block">
                          Total Quoted Investment
                        </span>
                        <span className="font-serif text-xl font-bold text-[#2B1A2E] block mt-1">
                          ₹{order.estimate_amount?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-[#635166] mt-0.5 block">
                          All-inclusive ceremonial decor
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#2F5D3A]/30">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#2F5D3A] block">
                          Stage 1: 50% Advance
                        </span>
                        <span className="font-serif text-xl font-bold text-[#2F5D3A] block mt-1">
                          ₹{advanceAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-[#635166] mt-0.5 block">
                          To reserve decorator & auspicious date
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#E8DAC8]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#E9A62B] block">
                          Stage 2: 50% Balance
                        </span>
                        <span className="font-serif text-xl font-bold text-[#2B1A2E] block mt-1">
                          ₹{balanceAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-[#635166] mt-0.5 block">
                          On event day after plate arrangement
                        </span>
                      </div>
                    </div>

                    {/* Artisan Notes if present */}
                    {order.notes && order.notes.includes("[Quote") && (
                      <div className="p-3 rounded-xl bg-white/80 border border-[#E8DAC8] text-xs text-[#2B1A2E] space-y-1">
                        <span className="font-semibold text-[11px] text-[#635166] block uppercase tracking-wider">
                          Artisan Notes & Material Inclusions:
                        </span>
                        <p className="whitespace-pre-wrap text-xs text-[#2B1A2E]">
                          {order.notes.split("\n").filter((l) => l.includes("[Quote")).join("\n")}
                        </p>
                      </div>
                    )}

                    {/* Direct Confirmation Action */}
                    {order.status === "quoted" && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs text-[#635166]">
                          💬 Ready to proceed? Message us on WhatsApp to confirm your slot with 50% advance:
                        </span>
                        <a
                          href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                            `Vanakkam BRB Decors! I accept the formal quote of ₹${order.estimate_amount?.toLocaleString("en-IN")} for Order #${order.id}. Please send UPI / Bank details for the 50% advance (₹${advanceAmount.toLocaleString("en-IN")}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#2F5D3A] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#214229] transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#E9A62B]" />
                          <span>Confirm & Pay 50% Advance (₹{advanceAmount.toLocaleString("en-IN")})</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Ceremony Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF5EE] space-y-1">
                    <span className="text-[#635166] text-[10px] uppercase font-bold block">Ceremony Type</span>
                    <span className="font-semibold text-sm text-[#2B1A2E] block capitalize">
                      {order.occasion.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-[#2F5D3A] font-medium">
                      {order.service_type === "diy" ? "Decoration Only" : "Full-Service Plating"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF5EE] space-y-1">
                    <span className="text-[#635166] text-[10px] uppercase font-bold block">Function Date</span>
                    <span className="font-semibold text-sm text-[#2B1A2E] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2F5D3A]" />
                      <span>{order.function_date}</span>
                    </span>
                    <span className="text-[11px] text-[#635166] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{order.city} {order.venue ? `(${order.venue})` : ""}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF5EE] space-y-1">
                    <span className="text-[#635166] text-[10px] uppercase font-bold block">Plates Configured</span>
                    <span className="font-semibold text-sm text-[#2B1A2E] flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#2F5D3A]" />
                      <span>{order.plate_count} Arranged Plates</span>
                    </span>
                    <span className="text-[11px] text-[#635166]">
                      {order.stage_required ? "Stage Backdrop Included" : "Plates Only"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF5EE] space-y-1">
                    <span className="text-[#635166] text-[10px] uppercase font-bold block">Quotation Status</span>
                    <span className="font-semibold text-xs text-[#2B1A2E] block">
                      {hasFormalQuote
                        ? `Formal Quote: ₹${order.estimate_amount?.toLocaleString("en-IN")}`
                        : "Artisan Review in Progress"}
                    </span>
                    <span className="text-[10px] text-[#2F5D3A] block">
                      {hasFormalQuote ? "50% Advance & 50% on Event Day" : "Quoted by Admin upon slot check"}
                    </span>
                  </div>
                </div>

                {/* Plate Types Requested */}
                {order.plate_types && order.plate_types.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[#635166] font-semibold text-[11px] uppercase tracking-wider block">
                      Plate Categories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {order.plate_types.map((type) => (
                        <span
                          key={type}
                          className="px-2.5 py-1 rounded-full bg-[#FAF3E7] text-[#2B1A2E] border border-[#E8DAC8] text-[11px] capitalize"
                        >
                          {type.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Inspiration Photos if any */}
                {order.inspirations && order.inspirations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E8DAC8]/40 text-xs">
                    <span className="text-[#635166] font-semibold text-[11px] uppercase tracking-wider block">
                      Your Inspiration Photos ({order.inspirations.length}):
                    </span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {order.inspirations.map((insp, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded-xl overflow-hidden border border-[#E8DAC8] bg-[#FAF5EE] shrink-0 relative group"
                        >
                          <Image
                            src={insp.url}
                            alt={insp.preview_title || "Inspiration"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Actions: Cancel Order */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E8DAC8]/60 text-xs">
                  <div className="text-[11px] text-[#635166]">
                    Client: <strong>{order.customer_name}</strong> ({order.phone})
                  </div>

                  {canCancel && (
                    <button
                      onClick={() => setCancellingOrder(order)}
                      className="px-3.5 py-1.5 rounded-full border border-red-300 text-red-700 bg-red-50/50 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.status === "cancelled" && (
                    <span className="text-xs font-semibold text-red-600 italic">
                      Order Cancelled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCELLATION CONFIRMATION MODAL */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border-2 border-red-200 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 font-serif font-bold text-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Cancel Ceremonial Order</span>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="text-[#635166] hover:text-[#2B1A2E] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#635166] leading-relaxed">
              Are you sure you want to cancel order <strong>#{cancellingOrder.id}</strong> for the{" "}
              <span className="text-[#2B1A2E] font-semibold">{cancellingOrder.occasion.replace("_", " ")}</span> ceremony on{" "}
              <strong>{cancellingOrder.function_date}</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#2B1A2E] mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Ceremony postponed, change of mind..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF5EE] text-xs text-[#2B1A2E] focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                disabled={cancellingInProgress}
                className="px-4 py-2 rounded-full border border-[#E8DAC8] bg-[#FFFDF9] text-xs font-semibold text-[#2B1A2E] hover:bg-[#FAF3E7]"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancellingInProgress}
                className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancellingInProgress ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
