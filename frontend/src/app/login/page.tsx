"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import {
  api,
  getCustomerUser,
  removeCustomerToken,
} from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";

function CustomerAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const u = getCustomerUser();
    if (u) {
      router.replace(redirectPath || "/");
      return;
    }
    if (initialMode === "register") {
      setMode("register");
    }
  }, [initialMode, redirectPath, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !email.trim()) {
      setError("Please enter both your mobile number and email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.customerLogin(phone.trim(), email.trim());
      setCurrentUser(res.user);
      router.push(redirectPath || "/");
    } catch (err: any) {
      setError(err.message || "No account found matching this mobile number and email. Please check your details or create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError("Please fill in your name, mobile number, and email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.customerRegister({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      setCurrentUser(res.user);
      router.push(redirectPath || "/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeCustomerToken();
    setCurrentUser(null);
    setSuccessMsg("Signed out successfully.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FBF6EC]">
      <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-7 sm:p-10 border-2 border-[#E8DAC8] shadow-xl space-y-7">
        {/* Header Ceremonial Emblem */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#2F5D3A] text-[#FBF6EC] mx-auto flex items-center justify-center border-2 border-[#E4C580] shadow-md">
            <Sparkles className="w-7 h-7 text-[#E9A62B]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5D3A]">
            Ceremonial Customer Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1A2E]">
            {SITE_CONFIG.businessName}
          </h1>
          <p className="text-xs text-[#635166]">
            {mode === "login"
              ? "Sign in to track your ceremonial plate bookings, formal quotes & designs."
              : "Create an account to track your ceremonial plate bookings, formal quotes & designs."}
          </p>
        </div>

        {/* Tabs for Login vs Register */}
        <div className="flex rounded-xl bg-[#FAF3E7] p-1 border border-[#E8DAC8]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-[#2F5D3A] text-white shadow-xs"
                : "text-[#635166] hover:text-[#2B1A2E]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-[#2F5D3A] text-white shadow-xs"
                : "text-[#635166] hover:text-[#2B1A2E]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error & Success Alerts */}
        {error && (
          <div className="p-3 rounded-2xl bg-[#FFF0F0] border border-[#F5C2C2] text-xs text-[#A8232F] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#2F5D3A] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM (PHONE NUMBER & EMAIL ONLY) */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E9A62B]" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 7010875133"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E9A62B]" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="pt-2">
              <PetalButton
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <span>{loading ? "Signing in..." : "Sign In to BRB Decors"}</span>
                <ArrowRight className="w-4 h-4" />
              </PetalButton>
            </div>

            <div className="text-center pt-2 border-t border-[#E8DAC8]/60">
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-[#8B5E14] hover:text-[#2F5D3A] hover:underline font-medium"
              >
                Don&apos;t have an account yet? <span className="font-bold underline text-[#2F5D3A]">Create Account here</span>
              </button>
            </div>
          </form>
        )}

        {/* CREATE ACCOUNT FORM (NAME, MOBILE NUMBER, EMAIL ONLY) */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E9A62B]" />
                <span>Your Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Amritha Sundaram"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E9A62B]" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 7010875133"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E9A62B]" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. amritha@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
            </div>

            <div className="pt-2">
              <PetalButton
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <span>{loading ? "Creating Account..." : "Create Customer Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </PetalButton>
            </div>

            <div className="text-center pt-2 border-t border-[#E8DAC8]/60">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-[#8B5E14] hover:text-[#2F5D3A] hover:underline font-medium"
              >
                Already have an account? <span className="font-bold underline text-[#2F5D3A]">Sign In here</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Links */}
        <div className="pt-2 border-t border-[#E8DAC8]/60 flex items-center justify-between text-xs text-[#635166]">
          <Link href="/" className="hover:text-[#2F5D3A] underline transition-colors">
            ← Back to Home
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-[#2F5D3A] flex items-center gap-1 font-semibold text-[#2F5D3A]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF6EC]">
          <div className="w-10 h-10 border-4 border-[#2F5D3A] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CustomerAuthContent />
    </Suspense>
  );
}
