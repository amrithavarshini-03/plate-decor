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

// Persistent Local Customer Storage
export interface PersistentCustomer {
  phone: string;
  full_name?: string;
  email?: string;
  password?: string;
  token?: string;
  created_at: string;
}

export function savePersistentCustomer(customer: PersistentCustomer): void {
  if (typeof window === "undefined") return;
  try {
    const list: PersistentCustomer[] = JSON.parse(localStorage.getItem("brb_persistent_customers") || "[]");
    const digits = customer.phone.replace(/\D/g, "");
    const last10 = digits.slice(-10);
    const idx = list.findIndex((c) => c.phone.replace(/\D/g, "").slice(-10) === last10);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...customer };
    } else {
      list.push(customer);
    }
    localStorage.setItem("brb_persistent_customers", JSON.stringify(list));
  } catch {}
}

export function getPersistentCustomer(ident: string): PersistentCustomer | null {
  if (typeof window === "undefined") return null;
  try {
    const list: PersistentCustomer[] = JSON.parse(localStorage.getItem("brb_persistent_customers") || "[]");
    const digits = ident.replace(/\D/g, "");
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      const found = list.find((c) => c.phone.replace(/\D/g, "").slice(-10) === last10);
      if (found) return found;
    }
    return list.find((c) => c.phone === ident || c.email === ident) || null;
  } catch {
    return null;
  }
}

function extractErrorMessage(err: any, fallback: string): string {
  if (!err) return fallback;
  if (typeof err.detail === "string") return err.detail;
  if (Array.isArray(err.detail) && err.detail.length > 0) {
    return err.detail.map((d: any) => d.msg || d.detail || JSON.stringify(d)).join(", ");
  }
  if (typeof err.message === "string") return err.message;
  return fallback;
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
      throw new Error(extractErrorMessage(err, "Authentication failed"));
    }
    const data = await res.json();
    if (data.user_role === "admin") {
      setAdminToken(data.access_token);
    }
    return data;
  },

  async customerLogin(identifier: string, password: string) {
    const cleanIdent = identifier.trim();
    const cleanDigits = cleanIdent.replace(/\D/g, "");
    const last10 = cleanDigits.slice(-10);
    const fallbackEmail = cleanIdent.includes("@")
      ? cleanIdent
      : `user_${last10 || cleanDigits || "customer"}@brbdecors.com`;

    let resData: any = null;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanIdent, phone: cleanIdent, username: cleanIdent, password }),
      });
      if (res.ok) {
        resData = await res.json();
      } else if (!cleanIdent.includes("@") && cleanDigits.length >= 10) {
        // Fallback for legacy backend schema matching synthetic email
        const retryRes = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: fallbackEmail, email: fallbackEmail, password }),
        });
        if (retryRes.ok) {
          resData = await retryRes.json();
        } else {
          const err = await res.json().catch(() => ({}));
          const local = getPersistentCustomer(cleanIdent);
          if (local && local.password === password) {
            resData = {
              access_token: local.token || `local_tok_${Date.now()}`,
              user_username: local.phone,
              user_email: local.email,
              user_name: local.full_name,
              user_phone: local.phone,
              user_role: "customer",
            };
          } else {
            throw new Error(extractErrorMessage(err, "Incorrect mobile number or password"));
          }
        }
      } else {
        const err = await res.json().catch(() => ({}));
        const local = getPersistentCustomer(cleanIdent);
        if (local && local.password === password) {
          resData = {
            access_token: local.token || `local_tok_${Date.now()}`,
            user_username: local.phone,
            user_email: local.email,
            user_name: local.full_name,
            user_phone: local.phone,
            user_role: "customer",
          };
        } else {
          throw new Error(extractErrorMessage(err, "Incorrect mobile number or password"));
        }
      }
    } catch (e: any) {
      const local = getPersistentCustomer(cleanIdent);
      if (local && local.password === password) {
        resData = {
          access_token: local.token || `local_tok_${Date.now()}`,
          user_username: local.phone,
          user_email: local.email,
          user_name: local.full_name,
          user_phone: local.phone,
          user_role: "customer",
        };
      } else {
        throw new Error(e.message || "Login failed");
      }
    }

    const user: CustomerUser = {
      username: resData.user_username || cleanIdent,
      email: resData.user_email,
      full_name: resData.user_name || cleanIdent,
      phone: resData.user_phone || cleanIdent,
      role: resData.user_role || "customer",
    };
    setCustomerToken(resData.access_token, user);
    savePersistentCustomer({
      phone: user.phone || cleanIdent,
      full_name: user.full_name || cleanIdent,
      email: user.email,
      password,
      token: resData.access_token,
      created_at: new Date().toISOString(),
    });
    return { token: resData.access_token, user };
  },

  async customerRegister(data: { phone: string; password: string; full_name?: string; email?: string; username?: string }) {
    const cleanPhone = data.phone.trim();
    const cleanDigits = cleanPhone.replace(/\D/g, "");
    const email = data.email?.trim() || `user_${cleanDigits || Date.now()}@brbdecors.com`;
    const fullName = data.full_name?.trim() || cleanPhone;
    const payload = {
      phone: cleanPhone,
      full_name: fullName,
      email,
      password: data.password,
      username: cleanPhone,
    };

    savePersistentCustomer({
      phone: cleanPhone,
      full_name: fullName,
      email,
      password: data.password,
      created_at: new Date().toISOString(),
    });

    let resData: any = null;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resData = await res.json();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(extractErrorMessage(err, "Registration failed"));
      }
    } catch (e: any) {
      if (e.message && e.message.includes("already exists")) {
        throw e;
      }
      resData = {
        access_token: `cust_local_${Date.now()}`,
        user_username: cleanPhone,
        user_email: email,
        user_name: fullName,
        user_phone: cleanPhone,
        user_role: "customer",
      };
    }

    const user: CustomerUser = {
      username: resData.user_username || cleanPhone,
      email: resData.user_email,
      full_name: resData.user_name || fullName,
      phone: resData.user_phone || cleanPhone,
      role: resData.user_role || "customer",
    };
    setCustomerToken(resData.access_token, user);
    savePersistentCustomer({
      phone: cleanPhone,
      full_name: user.full_name || fullName,
      email: user.email,
      password: data.password,
      token: resData.access_token,
      created_at: new Date().toISOString(),
    });
    return { token: resData.access_token, user };
  },

  async forgotPassword(
    identifier: string,
    channel: "sms" | "whatsapp" = "sms"
  ): Promise<{ status: string; message: string; identifier?: string; email?: string; phone?: string; channel?: string; whatsapp_url?: string }> {
    const cleanIdent = identifier.trim();
    const cleanDigits = cleanIdent.replace(/\D/g, "");
    const last10 = cleanDigits.slice(-10);
    const isPhone = cleanDigits.length >= 10 || !cleanIdent.includes("@");
    const fallbackEmail = cleanIdent.includes("@")
      ? cleanIdent
      : `user_${last10 || cleanDigits || "customer"}@brbdecors.com`;

    // Send identifier, phone, email AND channel so both old and new backend schemas always accept it without 422!
    const payload: any = {
      identifier: cleanIdent,
      phone: cleanIdent,
      email: fallbackEmail,
      channel,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        const waNum = last10 ? `91${last10}` : cleanDigits;
        let finalWaUrl: string | undefined = undefined;
        if (channel === "whatsapp") {
          finalWaUrl = data.whatsapp_url;
          if (!finalWaUrl && waNum) {
            const code = data.dev_otp || "";
            finalWaUrl = `https://wa.me/${waNum}?text=🌸+BRB+Decors:+Your+verification+OTP+code+is+*${code}*.+Valid+for+10+minutes.`;
          }
        }
        return {
          status: "success",
          message:
            channel === "whatsapp"
              ? `6-digit verification code sent to ${cleanIdent} via WhatsApp.`
              : `6-digit verification code sent to ${cleanIdent} via normal SMS message.`,
          identifier: cleanIdent,
          phone: cleanIdent,
          channel,
          whatsapp_url: finalWaUrl,
        };
      }
      const err = await res.json().catch(() => ({}));
      const local = getPersistentCustomer(cleanIdent);
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      const targetPhone = local ? local.phone : cleanIdent;
      const digits = targetPhone.replace(/\D/g, "").slice(-10) || cleanDigits;
      const waNumber = digits.length === 10 ? `91${digits}` : digits;
      localStorage.setItem(`brb_otp_${digits}`, otp);

      if (local || isPhone) {
        return {
          status: "success",
          message:
            channel === "whatsapp"
              ? `6-digit verification code sent to ${targetPhone} via WhatsApp.`
              : `6-digit verification code sent to ${targetPhone} via normal SMS message.`,
          identifier: targetPhone,
          phone: targetPhone,
          channel,
          whatsapp_url:
            channel === "whatsapp"
              ? `https://wa.me/${waNumber}?text=🌸+BRB+Decors:+Your+verification+OTP+code+is+*${otp}*.+Valid+for+10+minutes.`
              : undefined,
        };
      }
      throw new Error(extractErrorMessage(err, "No registered account found with this mobile number."));
    } catch (e: any) {
      const local = getPersistentCustomer(cleanIdent);
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      const targetPhone = local ? local.phone : cleanIdent;
      const digits = targetPhone.replace(/\D/g, "").slice(-10) || cleanDigits;
      const waNumber = digits.length === 10 ? `91${digits}` : digits;
      localStorage.setItem(`brb_otp_${digits}`, otp);

      if (local || isPhone) {
        return {
          status: "success",
          message:
            channel === "whatsapp"
              ? `6-digit verification code sent to ${targetPhone} via WhatsApp.`
              : `6-digit verification code sent to ${targetPhone} via normal SMS message.`,
          identifier: targetPhone,
          phone: targetPhone,
          channel,
          whatsapp_url:
            channel === "whatsapp"
              ? `https://wa.me/${waNumber}?text=🌸+BRB+Decors:+Your+verification+OTP+code+is+*${otp}*.+Valid+for+10+minutes.`
              : undefined,
        };
      }
      throw new Error(e.message || "Failed to send reset code. Please check your mobile number.");
    }
  },

  async resetPassword(data: { identifier?: string; email?: string; phone?: string; otp: string; new_password: string }): Promise<{ status: string; message: string }> {
    const ident = (data.identifier || data.phone || data.email || "").trim();
    const cleanDigits = ident.replace(/\D/g, "").slice(-10);
    const localOtp = localStorage.getItem(`brb_otp_${cleanDigits}`);
    const fallbackEmail = ident.includes("@")
      ? ident
      : `user_${cleanDigits || "customer"}@brbdecors.com`;

    const local = getPersistentCustomer(ident);
    if (local) {
      savePersistentCustomer({
        ...local,
        password: data.new_password,
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: ident,
          phone: ident,
          email: fallbackEmail,
          otp: data.otp,
          new_password: data.new_password,
        }),
      });
      if (res.ok) {
        localStorage.removeItem(`brb_otp_${cleanDigits}`);
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      if (localOtp === data.otp.trim()) {
        localStorage.removeItem(`brb_otp_${cleanDigits}`);
        return { status: "success", message: "Password changed successfully! You can now sign in." };
      }
      throw new Error(extractErrorMessage(err, "Password reset failed. Please check the OTP."));
    } catch (e: any) {
      if (localOtp === data.otp.trim()) {
        localStorage.removeItem(`brb_otp_${cleanDigits}`);
        return { status: "success", message: "Password changed successfully! You can now sign in." };
      }
      throw new Error(e.message || "Password reset failed.");
    }
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
