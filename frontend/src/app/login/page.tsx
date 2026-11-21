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
  const redirectPath = searchParams.get("redirect") || "/my-orders";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1 = request OTP, 2 = verify & reset

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const u = getCustomerUser();
    if (u) setCurrentUser(u);
    if (initialMode === "register") {
      setMode("register");
    }
  }, [initialMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.customerLogin(identifier, password);
      setSuccessMsg(`Vanakkam, ${res.user.full_name || res.user.username}! Welcome back.`);
      setCurrentUser(res.user);
      setTimeout(() => {
        router.push(redirectPath);
      }, 900);
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
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
        username,
        email,
        phone,
        password,
        full_name: fullName || username,
      });
      setSuccessMsg(`Account created successfully! Vanakkam, ${res.user.full_name || res.user.username}.`);
      setCurrentUser(res.user);
      setTimeout(() => {
        router.push(redirectPath);
      }, 900);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotStep(2);
      if (res.dev_otp) {
        setOtp(res.dev_otp);
        setSuccessMsg(`Verification code generated! (Dev/Test code: ${res.dev_otp})`);
      } else {
        setSuccessMsg(res.message || `6-digit verification code sent to ${forgotEmail}. Please check your email.`);
      }
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.toLowerCase().includes("no registered account found")) {
        setError("No registered account found with this email address. Please click 'Create Account' to sign up first.");
      } else {
        setError(errMsg || "Could not send OTP. Please check the email address.");
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
        email: forgotEmail.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setSuccessMsg(res.message || "Password changed successfully! You can now sign in.");
      setMode("login");
      setIdentifier(forgotEmail.trim());
      setForgotStep(1);
      setOtp("");
      setNewPassword("");
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

        {/* If already logged in */}
        {currentUser ? (
          <div className="p-6 rounded-2xl bg-[#2F5D3A]/5 border border-[#2F5D3A]/20 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center mx-auto text-lg font-serif font-bold">
              {currentUser.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs text-[#635166]">Logged in as</p>
              <h3 className="font-serif text-lg font-bold text-[#2B1A2E]">
                {currentUser.full_name || currentUser.username}
              </h3>
              <p className="text-xs text-[#2F5D3A] font-medium">@{currentUser.username}</p>
              {currentUser.email && <p className="text-[11px] text-[#635166]">{currentUser.email}</p>}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Link
                href="/my-orders"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#2F5D3A] text-white text-xs font-semibold hover:bg-[#214229] transition-colors shadow-xs"
              >
                View My Orders
              </Link>
              <Link
                href="/plan"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FAF3E7] text-[#2B1A2E] text-xs font-semibold hover:bg-[#E8DAC8] border border-[#E8DAC8] transition-colors"
              >
                Plate Planner
              </Link>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FFF0F0] text-[#A8232F] text-xs font-semibold hover:bg-[#FFE5E5] border border-[#F5C2C2] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
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
                    <User className="w-3.5 h-3.5 text-[#E9A62B]" />
                    <span>Username or Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username or email"
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
                        if (identifier.includes("@")) {
                          setForgotEmail(identifier);
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
                    <span>Choose Username *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. anand_chennai"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                  />
                </div>

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
                    <span>WhatsApp Contact Number *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-xs text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#E9A62B]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. anand@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-xs text-[#635166] leading-relaxed">
                      Enter the email address registered with your BRB Decors account. We will send you a 6-digit OTP to reset your password.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>Your Registered Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. anand@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
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
                        <span>{loading ? "Sending OTP Code..." : "Send Verification OTP"}</span>
                        <KeyRound className="w-4 h-4" />
                      </PetalButton>
                    </div>

                    <div className="text-center pt-2 border-t border-[#E8DAC8]/60">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("register");
                          setEmail(forgotEmail);
                          setError(null);
                        }}
                        className="text-xs text-[#8B5E14] hover:text-[#2F5D3A] hover:underline font-medium"
                      >
                        Don&apos;t have an account yet? <span className="font-bold underline text-[#2F5D3A]">Create Account here</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <p className="text-xs text-[#635166] leading-relaxed">
                      Enter the 6-digit OTP code sent to <strong>{forgotEmail}</strong> and your desired new password.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#2B1A2E] flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#E9A62B]" />
                        <span>6-Digit Verification OTP</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DAC8] bg-[#FAF3E7] text-center font-mono text-base font-bold tracking-widest text-[#2B1A2E] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
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

                    <div className="pt-2 space-y-2">
                      <PetalButton
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3"
                      >
                        <span>{loading ? "Updating Password..." : "Change & Save Password"}</span>
                        <CheckCircle className="w-4 h-4" />
                      </PetalButton>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full py-2 text-[11px] text-[#8B5E14] hover:text-[#2F5D3A] flex items-center justify-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Didn&apos;t receive OTP? Resend code</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
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
