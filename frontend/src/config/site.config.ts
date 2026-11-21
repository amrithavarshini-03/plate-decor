// Configuration constants for BRB Decors
// Central place to customize business information and placeholders

export const SITE_CONFIG = {
  businessName: "BRB Decors",
  legalName: "BRB Decors & Ceremonial Plating Studio",
  tagline: "BRB, we’re arranging something beautiful",
  taglineTamil: "பொறுத்திருங்கள், அழகாய் அலங்கரித்துக் கொண்டிருக்கிறோம்",
  phone: "+91 80563 43769",
  whatsappNumber: "918056343769",
  whatsappMessage: "Vanakkam! I would like to inquire about plate decorations for an upcoming ceremony.",
  email: "vanakkam@brbdecors.com",
  instagramHandle: "@brb_decors",
  instagramUrl: "https://instagram.com/brb_decors",
  location: "Coimbatore & across Tamil Nadu",
  address: "Coimbatore",
  hours: "Monday - Sunday: 9:00 AM - 8:00 PM (IST)",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  bookingDepositDefault: 2000, // in INR
  featureFlags: {
    enableOnlinePayments: false, // Razorpay deposit disabled by default
    enableAuspiciousDates: true,
    enableHotspotAffiliate: true,
  },
  placeholdersPath: "/images/placeholders",
};

export type OccasionType =
  | "puberty"
  | "wedding"
  | "baby_shower"
  | "housewarming"
  | "birthday"
  | "festivals"
  | "other";

export type PlateType =
  | "fruits"
  | "flowers"
  | "sweets_dryfruits"
  | "deity"
  | "baby_theme"
  | "stage_backdrop";
