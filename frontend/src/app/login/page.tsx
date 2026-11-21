"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import {
  api,
  getCustomerUser,
  setCustomerToken,
  removeCustomerToken,
} from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";
import { PetalButton } from "@/components/primitives/PetalButton";

function CustomerAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  // Forgot password states
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "whatsapp">("sms");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1 = request OTP, 2 = verify & reset

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const u = getCustomerUser();
    if (u) {
      router.replace("/");
      return;
    }
    if (initialMode === "register") {
      setMode("register");
    }
  }, [initialMode, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.customerLogin(identifier.trim(), password);
      setCurrentUser(res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.customerRegister({
        phone: phone.trim(),
        password,
        full_name: fullName.trim(),
      });
      setCurrentUser(res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (channel: "sms" | "whatsapp" = "sms") => {
    if (!forgotIdentifier.trim()) {
      setError("Please enter your registered mobile number.");
      return;
    }
    setError(null);
    setLoading(true);
    setOtp(""); // NEVER show or auto-fill OTP on screen
    setSelectedChannel(channel);

    try {
      const res = await api.forgotPassword(forgotIdentifier.trim(), channel);
      setForgotStep(2);
      if (res.whatsapp_url) {
        setWhatsappUrl(res.whatsapp_url);
      } else {
        setWhatsappUrl(null);
      }
      setSuccessMsg(
        res.message ||
          (channel === "whatsapp"
            ? `6-digit verification code sent to ${forgotIdentifier.trim()} on WhatsApp.`
            : `6-digit verification code sent to ${forgotIdentifier.trim()} via normal SMS message.`)
      );
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.toLowerCase().includes("no registered account found")) {
        setError("No registered account found with this mobile number. Please click 'Create Account' to sign up first.");
      } else {
        setError(errMsg || "Could not send OTP. Please check your mobile number.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword) {
      setError("Please enter the 6-digit OTP and your new password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.resetPassword({
        identifier: forgotIdentifier.trim(),
        email: forgotIdentifier.trim(),
        phone: forgotIdentifier.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setSuccessMsg(res.message || "Password changed successfully! You can now sign in.");
      setMode("login");
      setIdentifier(forgotIdentifier.trim());
      setForgotStep(1);
      setOtp("");
      setNewPassword("");
      setWhatsappUrl(null);
    } catch (err: any) {
      setError(err.message || "Password reset failed. Please verify the OTP.");
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
            {mode === "forgot"
              ? "Reset your password via one-time verification code."
              : "Sign in to track your ceremonial plate bookings, formal quotes & designs."}
          </p>
        </div>

            {/* Tabs for Login vs Register (only when not in forgot password mode) */}
            {mode !== "forgot" ? (
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
            ) : (
              <div className="flex items-center justify-between pb-2 border-b border-[#E8DAC8]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5D3A] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <span className="text-xs font-serif font-bold text-[#2B1A2E]">
                  Password Recovery
                </span>
              </div>
            )}

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

            {/* SIGN IN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#E9A62B]" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 7010875133"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#E9A62B]" />
                      <span>Password</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setForgotStep(1);
                        setError(null);
                        setSuccessMsg(null);
                        if (identifier.trim()) {
                          setForgotIdentifier(identifier.trim());
                        }
                      }}
                      className="text-[11px] font-semibold text-[#8B5E14] hover:text-[#2F5D3A] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </form>
            )}

            {/* CREATE ACCOUNT FORM */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E9A62B]" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Sundaram"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#E9A62B]" />
                    <span>Password (min. 6 characters) *</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
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
              </form>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {mode === "forgot" && (
              <div className="space-y-4">
                {forgotStep === 1 ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendOtp("sms");
                    }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-[#635166] leading-relaxed">
                      Enter your registered <strong>Mobile Number</strong>. We will send a 6-digit OTP verification code to your phone.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>Registered Mobile Number</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 7010875133"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                      />
                    </div>

                    <div className="pt-2 space-y-2.5">
                      {/* Default: Normal SMS */}
                      <PetalButton
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4 text-[#FFFDF9]" />
                        <span>{loading && selectedChannel === "sms" ? "Sending SMS..." : "Send OTP via SMS (Normal Message)"}</span>
                      </PetalButton>

                      {/* On request: WhatsApp */}
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSendOtp("whatsapp")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/20 transition-all shadow-2xs"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>{loading && selectedChannel === "whatsapp" ? "Sending WhatsApp..." : "Send OTP via WhatsApp"}</span>
                      </button>
                    </div>

                    <div className="text-center pt-2 border-t border-[#E8DAC8]/60">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("register");
                          setPhone(forgotIdentifier);
                          setError(null);
                        }}
                        className="text-xs text-[#8B5E14] hover:text-[#2F5D3A] hover:underline font-medium"
                      >
                        Don&apos;t have an account yet? <span className="font-bold underline text-[#2F5D3A]">Create Account here</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF3E7] border border-[#E8DAC8] text-xs text-[#635166] leading-relaxed">
                      {selectedChannel === "whatsapp" ? (
                        <span>
                          A 6-digit OTP code has been dispatched to <strong>{forgotIdentifier}</strong> on <strong>WhatsApp</strong>.
                        </span>
                      ) : (
                        <span>
                          A 6-digit OTP code has been dispatched to <strong>{forgotIdentifier}</strong> via <strong>normal SMS message</strong>.
                        </span>
                      )}
                      <p className="mt-1 text-[11px] text-[#8B5E14]">
                        Please check your phone inbox and enter the 6-digit code below.
                      </p>
                    </div>

                    {selectedChannel === "whatsapp" && whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/25 transition-colors shadow-2xs"
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>Open WhatsApp to View Message</span>
                      </a>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>6-Digit Verification OTP</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit code received"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-center font-mono text-base font-bold tracking-widest text-[#2B1A2E] placeholder:text-xs placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>New Password (min. 6 characters)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your new secure password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                      />
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <PetalButton
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3"
                      >
                        <span>{loading ? "Updating Password..." : "Change & Save Password"}</span>
                        <CheckCircle className="w-4 h-4" />
                      </PetalButton>

                      {/* Resend actions */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleSendOtp("sms")}
                          disabled={loading}
                          className="text-[#8B5E14] hover:text-[#2F5D3A] flex items-center gap-1 font-semibold hover:underline"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend via SMS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendOtp("whatsapp")}
                          disabled={loading}
                          className="text-[#128C7E] hover:text-[#2F5D3A] flex items-center gap-1 font-semibold hover:underline"
                        >
                          <MessageCircle className="w-3 h-3 text-[#25D366]" />
                          <span>Send via WhatsApp instead</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
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
