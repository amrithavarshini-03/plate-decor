"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { api } from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(identifier, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FBF6EC]">
      <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 border-2 border-[#E8DAC8] shadow-xl space-y-8">
        {/* Ceremonial Plate Rim Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#2F5D3A] text-[#FBF6EC] mx-auto flex items-center justify-center border-2 border-[#E4C580] shadow-md">
            <Lock className="w-8 h-8 text-[#E9A62B]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F5D3A]">
            Administrative Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B1A2E]">
            {SITE_CONFIG.businessName} Studio
          </h1>
          <p className="text-xs text-[#635166]">
            Secure management for ceremonial bookings, plate galleries & stores.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF0F0] border border-[#F5C2C2] text-xs text-[#A8232F] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E9A62B]" />
              <span>Admin Username or Email</span>
            </label>
            <input
              type="text"
              placeholder="e.g. admin or admin@brbdecors.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E9A62B]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-sm text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
            />
          </div>

          <div className="pt-2">
            <PetalButton
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <span>{loading ? "Opening Studio..." : "Enter Studio Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </PetalButton>
          </div>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-[#635166] hover:text-[#2F5D3A] underline transition-colors"
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
