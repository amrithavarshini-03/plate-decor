"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { getAdminToken, removeAdminToken } from "@/services/api";
import { SITE_CONFIG } from "@/config/site.config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }
    const token = getAdminToken();
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FBF6EC] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-[#FFFDF9] border-b border-[#E8DAC8] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2F5D3A] flex items-center justify-center text-white font-serif text-sm font-bold border border-[#E9A62B]">
              B
            </div>
            <div>
              <span className="font-serif font-bold text-base text-[#2B1A2E] leading-none block">
                {SITE_CONFIG.businessName} Admin
              </span>
              <span className="text-[10px] text-[#2F5D3A] font-semibold tracking-wide uppercase">
                Ceremonial Decor Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8DAC8] text-xs font-semibold text-[#2B1A2E] hover:bg-[#FAF3E7] transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#635166]" />
            </Link>

            <button
              onClick={() => {
                removeAdminToken();
                router.push("/admin/login");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF3E7] text-xs font-semibold text-[#A8232F] hover:bg-[#FFF0F0] border border-[#E8DAC8] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
