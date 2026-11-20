import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { CeremonialSplashScreen } from "@/components/layout/CeremonialSplashScreen";
import { SITE_CONFIG } from "@/config/site.config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.businessName} — Handcrafted Decorative Plates & Ceremonial Plating`,
  description:
    "Exquisite decorative thaalams, fruit mandalas, floral rings, and stage backdrops for weddings, puberty ceremonies, and baby showers in Tamil Nadu.",
  keywords: [
    "plate decoration",
    "seer varisai",
    "manjal neerattu vizha",
    "valaikappu plates",
    "chennai plate decor",
    "tamil nadu wedding seer",
    "BRB Decors",
  ],
  openGraph: {
    title: `${SITE_CONFIG.businessName} — ${SITE_CONFIG.tagline}`,
    description: "Handcrafted decorative thaalams and stage artistry for cherished Tamil ceremonies.",
    locale: "en_IN",
    type: "website",
    siteName: SITE_CONFIG.businessName,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_CONFIG.businessName,
  legalName: SITE_CONFIG.legalName,
  description: "Traditional decorative plates (thaalams), fruit mandalas and ceremonial stage decorations for weddings, puberty ceremonies and baby showers in Tamil Nadu.",
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Anna Nagar",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600040",
    addressCountry: "IN",
  },
  priceRange: "₹₹",
  openingHours: "Mo-Su 09:00-20:00",
  areaServed: ["Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${dmSans.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF6EC] text-[#2B1A2E] font-sans antialiased selection:bg-[#FCEFCF] selection:text-[#214229]">
        <LanguageProvider>
          <CeremonialSplashScreen />
          <CustomCursor />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}
