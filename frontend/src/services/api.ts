import { SITE_CONFIG } from "@/config/site.config";

const BASE_URL = SITE_CONFIG.apiUrl;

export interface ApiInspiration {
  id?: number;
  type: string;
  url: string;
  preview_title?: string;
  preview_image?: string;
}

export interface ApiBooking {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  city: string;
  venue?: string;
  function_date: string;
  occasion: string;
  custom_occasion?: string;
  service_type: string;
  plate_count: number;
  plate_types: string[];
  stage_required: boolean;
  theme_colors: string[];
  notes?: string;
  budget_range?: string;
  status: "new" | "quoted" | "confirmed" | "completed" | "cancelled";
  estimate_amount?: number;
  deposit_paid: boolean;
  deposit_amount?: number;
  deposit_reference?: string;
  created_at: string;
  updated_at: string;
  inspirations: ApiInspiration[];
}

export interface ApiGalleryHotspot {
  id?: number;
  gallery_item_id?: string;
  x_percent: number;
  y_percent: number;
  product_id?: string;
  title: string;
  product_name: string;
  affiliate_url: string;
  price_note?: string;
}

export interface ApiGalleryItem {
  id: string;
  title: string;
  title_tamil?: string;
  occasion: string;
  plate_type: string;
  color_theme: string;
  budget: string;
  price?: number;
  price_range?: string;
  image_url: string;
  is_featured: boolean;
  sort_order: number;
  description?: string;
  created_at?: string;
  hotspots?: ApiGalleryHotspot[];
}

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  image_url: string;
  affiliate_url: string;
  price_note?: string;
  occasion_tags: string[];
  is_active: boolean;
}

export interface ApiStore {
  id: string;
  name: string;
  area: string;
  city: string;
  map_url: string;
  speciality: string;
  discount_percent: number;
  discount_note: string;
  is_active: boolean;
}

export interface ApiDayStatus {
  date: string;
  status: string;
  reason?: string;
  is_auspicious: boolean;
}

export interface ApiAvailability {
  month: string;
  days: ApiDayStatus[];
  booked_dates: string[];
  blocked_dates: { id: number; date: string; reason: string; is_auspicious: boolean; notes?: string }[];
  auspicious_dates: string[];
}

export interface CustomerUser {
  id?: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
}

// Token helper for Admin
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("brb_admin_token");
}

export function setAdminToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("brb_admin_token", token);
  }
}

export function removeAdminToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("brb_admin_token");
  }
}

// Token helper for Customer Users
export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("brb_customer_token");
}

export function setCustomerToken(token: string, user?: CustomerUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("brb_customer_token", token);
    if (user) {
      localStorage.setItem("brb_customer_user", JSON.stringify(user));
    }
  }
}

export function getCustomerUser(): CustomerUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("brb_customer_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeCustomerToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("brb_customer_token");
    localStorage.removeItem("brb_customer_user");
  }
}

// Local order cache helpers (guarantees orders & quotes persist seamlessly even if backend offline)
export function saveCustomerOrderId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing: string[] = JSON.parse(localStorage.getItem("brb_customer_order_ids") || "[]");
    if (!existing.includes(id)) {
      existing.unshift(id);
      localStorage.setItem("brb_customer_order_ids", JSON.stringify(existing));
    }
  } catch {}
}

export function getCustomerOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("brb_customer_order_ids") || "[]");
  } catch {
    return [];
  }
}

export function saveLocalBooking(booking: ApiBooking): void {
  if (typeof window === "undefined") return;
  try {
    const existing: ApiBooking[] = JSON.parse(localStorage.getItem("brb_local_bookings") || "[]");
    const idx = existing.findIndex((b) => b.id === booking.id);
    if (idx >= 0) {
      existing[idx] = booking;
    } else {
      existing.unshift(booking);
    }
    localStorage.setItem("brb_local_bookings", JSON.stringify(existing));
    saveCustomerOrderId(booking.id);
  } catch {}
}

export function getLocalBookings(): ApiBooking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("brb_local_bookings") || "[]");
  } catch {
    return [];
  }
}

export function updateLocalBookingStatus(id: string, status: ApiBooking["status"]): void {
  if (typeof window === "undefined") return;
  try {
    const existing: ApiBooking[] = JSON.parse(localStorage.getItem("brb_local_bookings") || "[]");
    const found = existing.find((b) => b.id === id);
    if (found) {
      found.status = status;
      localStorage.setItem("brb_local_bookings", JSON.stringify(existing));
    }
  } catch {}
}

// Headers helper
function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(identifier: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, username: identifier, email: identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Authentication failed");
    }
    const data = await res.json();
    if (data.user_role === "admin") {
      setAdminToken(data.access_token);
    }
    return data;
  },

  async customerLogin(identifier: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, username: identifier, email: identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    const user: CustomerUser = {
      username: data.user_username || identifier,
      email: data.user_email,
      full_name: data.user_name || data.user_username,
      phone: data.user_phone,
      role: data.user_role,
    };
    setCustomerToken(data.access_token, user);
    return { token: data.access_token, user };
  },

  async customerRegister(data: { email: string; password: string; full_name?: string; phone?: string; username?: string }) {
    const payload = {
      ...data,
      username: data.username || data.email.split("@")[0].replace("+", "_"),
    };
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Registration failed");
    }
    const resData = await res.json();
    const user: CustomerUser = {
      username: resData.user_username || payload.username,
      email: resData.user_email,
      full_name: resData.user_name || data.full_name,
      phone: resData.user_phone || data.phone,
      role: resData.user_role,
    };
    setCustomerToken(resData.access_token, user);
    return { token: resData.access_token, user };
  },

  async forgotPassword(email: string): Promise<{ status: string; message: string; dev_otp?: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to send reset code");
    }
    return res.json();
  },

  async resetPassword(data: { email: string; otp: string; new_password: string }): Promise<{ status: string; message: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Password reset failed");
    }
    return res.json();
  },

  async updateAdminCredentials(data: { username?: string; password?: string; email?: string }) {
    const res = await fetch(`${BASE_URL}/api/auth/admin/credentials`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update admin credentials");
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  // Bookings
  async createBooking(bookingData: any): Promise<ApiBooking> {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to submit booking");
    }
    const data = await res.json();
    saveLocalBooking(data);
    return data;
  },

  async getMyOrders(params?: { email?: string; phone?: string; orderIds?: string[] }): Promise<ApiBooking[]> {
    const local = getLocalBookings();
    const storedIds = params?.orderIds && params.orderIds.length > 0 ? params.orderIds : getCustomerOrderIds();

    try {
      const query = new URLSearchParams();
      if (params?.email) query.set("email", params.email);
      if (params?.phone) query.set("phone", params.phone);
      if (storedIds.length > 0) query.set("order_ids", storedIds.join(","));

      const res = await fetch(`${BASE_URL}/api/bookings/my-orders?${query.toString()}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const remote: ApiBooking[] = await res.json();
        const mergedMap = new Map<string, ApiBooking>();
        local.forEach((b) => mergedMap.set(b.id, b));
        remote.forEach((b) => {
          const loc = mergedMap.get(b.id);
          mergedMap.set(b.id, { ...loc, ...b });
          saveLocalBooking({ ...loc, ...b });
        });
        return Array.from(mergedMap.values());
      }
    } catch {
      // Fallback to local bookings if offline or network error
    }
    return local;
  },

  async cancelBooking(id: string, reason?: string): Promise<ApiBooking> {
    updateLocalBookingStatus(id, "cancelled");
    try {
      const res = await fetch(
        `${BASE_URL}/api/bookings/${id}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const updated = await res.json();
        saveLocalBooking(updated);
        return updated;
      }
    } catch {}

    const local = getLocalBookings().find((b) => b.id === id);
    if (local) {
      local.status = "cancelled";
      return local;
    }
    return {
      id,
      customer_name: "Customer",
      phone: "",
      city: "Chennai",
      function_date: "",
      occasion: "",
      service_type: "full_service",
      plate_count: 5,
      plate_types: [],
      stage_required: false,
      theme_colors: [],
      status: "cancelled",
      deposit_paid: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      inspirations: [],
    };
  },

  async getBookings(params?: { status?: string; search?: string }): Promise<ApiBooking[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const res = await fetch(`${BASE_URL}/api/bookings?${query.toString()}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load bookings");
    return res.json();
  },

  async getBooking(id: string): Promise<ApiBooking> {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch booking");
    return res.json();
  },

  async updateBookingStatus(id: string, status: string, notes?: string): Promise<ApiBooking> {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },

  async updateBookingQuote(id: string, estimate_amount: number, notes?: string): Promise<ApiBooking> {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}/quote`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ estimate_amount, notes }),
    });
    if (!res.ok) throw new Error("Failed to update quote");
    return res.json();
  },

  async updateBookingDeposit(id: string, data: { deposit_paid: boolean; deposit_amount: number; deposit_reference?: string }): Promise<ApiBooking> {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}/deposit`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update deposit");
    return res.json();
  },

  async deleteBooking(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete booking");
  },

  // Gallery
  async getGallery(params?: { occasion?: string; plate_type?: string; color_theme?: string; budget?: string }): Promise<ApiGalleryItem[]> {
    const query = new URLSearchParams();
    if (params?.occasion && params.occasion !== "all") query.set("occasion", params.occasion);
    if (params?.plate_type && params.plate_type !== "all") query.set("plate_type", params.plate_type);
    if (params?.color_theme && params.color_theme !== "all") query.set("color_theme", params.color_theme);
    if (params?.budget && params.budget !== "all") query.set("budget", params.budget);
    const res = await fetch(`${BASE_URL}/api/gallery?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to load gallery");
    return res.json();
  },

  async createGalleryItem(data: any): Promise<ApiGalleryItem> {
    const res = await fetch(`${BASE_URL}/api/gallery`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create gallery item");
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete gallery item");
  },

  async addHotspot(itemId: string, hotspotData: any): Promise<ApiGalleryHotspot> {
    const res = await fetch(`${BASE_URL}/api/gallery/${itemId}/hotspots`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(hotspotData),
    });
    if (!res.ok) throw new Error("Failed to add hotspot");
    return res.json();
  },

  async deleteHotspot(hotspotId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/gallery/hotspots/${hotspotId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete hotspot");
  },

  // Products & Stores
  async getProducts(category?: string): Promise<ApiProduct[]> {
    const query = category && category !== "all" ? `?category=${category}` : "";
    const res = await fetch(`${BASE_URL}/api/products${query}`);
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
  },

  async createProduct(data: any): Promise<ApiProduct> {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete product");
  },

  async getStores(city?: string): Promise<ApiStore[]> {
    const query = city && city !== "all" ? `?city=${encodeURIComponent(city)}` : "";
    const res = await fetch(`${BASE_URL}/api/stores${query}`);
    if (!res.ok) throw new Error("Failed to load stores");
    return res.json();
  },

  async createStore(data: any): Promise<ApiStore> {
    const res = await fetch(`${BASE_URL}/api/stores`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create store");
    return res.json();
  },

  async deleteStore(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/stores/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete store");
  },

  // Availability
  async getAvailability(month?: string): Promise<ApiAvailability> {
    const query = month ? `?month=${month}` : "";
    const res = await fetch(`${BASE_URL}/api/availability${query}`);
    if (!res.ok) throw new Error("Failed to load availability");
    return res.json();
  },

  async blockDate(data: { date: string; reason: string; is_auspicious?: boolean; notes?: string }) {
    const res = await fetch(`${BASE_URL}/api/availability/block`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to block date");
    return res.json();
  },

  async unblockDate(id: number) {
    const res = await fetch(`${BASE_URL}/api/availability/block/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to unblock date");
  },

  // Upload
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/api/uploads`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Upload failed");
    }
    return res.json();
  },
};
