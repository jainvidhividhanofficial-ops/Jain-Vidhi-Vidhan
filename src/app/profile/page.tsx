"use client";

import { createClient } from "@supabase/supabase-js";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Upload,
  User,
  X
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Type definition for provider record
type ProviderRow = {
  id: number;
  providername?: string | null;
  providertype?: string[] | null;
  contactemail?: string | null;
  contactphone?: string | null;
  servicearea?: string | null;
  yearsexperience?: number | null;
  shortdescription?: string | null;
  servicesoffered?: string | null;
  profileimageurl?: string | null;
  videourls?: string[] | null;
  qualification?: string | null;
  institute?: string | null;
  services_pricing?: any | null;
  created_at?: string | null;
  auth_user_id?: string | null;
  user_id?: string | null;
};

// ✅ GeoNames API setup for city autocomplete
const GEONAMES_USERNAME = "pratzzzam";

// ✅ Load cities for AsyncPaginate dropdown
async function loadCityOptions(
  search: string,
  prevOptions: any,
  { page }: any
) {
  if (!search || search.length < 2) {
    return { options: [], hasMore: false };
  }

  try {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
        search
      )}&country=IN&maxRows=20&startRow=${
        (page - 1) * 20
      }&username=${GEONAMES_USERNAME}&featureClass=P&orderby=population`
    );

    const data = await response.json();

    if (data.status) {
      console.error("GeoNames API Error:", data.status.message);
      return { options: [], hasMore: false };
    }

    const options =
      data.geonames?.map((city: any) => ({
        value: city.name,
        label: `${city.name}, ${city.adminName1}`,
      })) || [];

    return {
      options,
      hasMore: data.geonames?.length === 20,
      additional: { page: page + 1 },
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { options: [], hasMore: false };
  }
}

// ✅ Custom styles for AsyncPaginate dropdown
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "2px solid #d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#a72c3e" },
    minHeight: "40px",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

// ✅ Dynamically import AsyncPaginate (for SSR safety)
const AsyncPaginate = dynamic(
  () => import("react-select-async-paginate").then((mod) => mod.AsyncPaginate),
  { ssr: false }
);

// ✅ MAIN COMPONENT
export default function ProviderDashboard() {
  // --- General states ---
  const [isEditing] = useState(true); // always editable
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<ProviderRow | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});
  // --- Video queue (for pending uploads) ---
const [pendingVideos, setPendingVideos] = useState<File[]>([]);


  // --- Profile image ---
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  // --- Tracking changes ---
  const [hasChanges, setHasChanges] = useState(false);

  // --- Calendar states ---
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [awayMode, setAwayMode] = useState(false);
  const [awayCity, setAwayCity] = useState<string>("");
  const [unavailableDates, setUnavailableDates] = useState<
    { date: string; type: "home" | "away"; city?: string }[]
  >([]);

  // ✅ handle city change
  const handleCityChange = (selectedOption: any) => {
    setAwayCity(selectedOption ? selectedOption.value : "");
  };

  // Bookings (mock)
  const bookings = [
    {
      id: 1,
      event: "Puja Ceremony",
      client: "Sharma Family",
      date: "18 Oct 2025",
      time: "10:00 AM",
      amount: "₹3,500",
    },
    {
      id: 2,
      event: "Wedding Ritual",
      client: "Patel Family",
      date: "22 Oct 2025",
      time: "6:00 AM",
      amount: "₹5,000",
    },
    {
      id: 3,
      event: "Griha Pravesh",
      client: "Jain Family",
      date: "28 Oct 2025",
      time: "11:00 AM",
      amount: "₹4,200",
    },
  ];

  // Scroll highlight (unchanged)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "calendar", "bookings", "profile"];
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calendar helpers
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };
  const { firstDay, daysInMonth, year, month } = getDaysInMonth();
  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  // Fetch profile: prefer localStorage.loggedInProviderId (backwards compat)
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const providerId = localStorage.getItem("loggedInProviderId");
        if (providerId) {
          // try to fetch by numeric id first
          const { data, error } = await supabase
            .from("providers")
            .select("*")
            .eq("id", providerId)
            .single();
          if (!error && data) {
            if (cancelled) return;
            setProfile(data as ProviderRow);
            setEditForm(normalizeForEdit(data));
            // load initial calendar/unavailable from data if present
            if ((data as any).unavailable_dates) {
              setUnavailableDates((data as any).unavailable_dates);
            }
            setProfileImagePreview((data as any).profileimageurl || "");
            return;
          } else {
            // fallback and try later using auth user id
            // console.warn('fetch by id error', error);
          }
        }

        // attempt using supabase auth user
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user;
        if (user) {
          // Try common provider fields that might reference auth UID
          // We'll attempt to match several candidate columns (auth_user_id, user_id, etc.)
          // Query via .or to try several possibilities
          // Note: supabase .or needs the exact column names; if DB doesn't have them, result may be empty.
          const uid = user.id;
          // Try by auth_user_id or user_id (string) - if not found, fallback to nothing
          const orQuery = `auth_user_id.eq.${uid},user_id.eq.${uid},id.eq.${uid}`;
          const { data: data2, error: err2 } = await supabase
            .from("providers")
            .select("*")
            .or(orQuery)
            .limit(1);
          if (!err2 && data2 && data2.length > 0) {
            const p = data2[0];
            if (cancelled) return;
            setProfile(p as ProviderRow);
            setEditForm(normalizeForEdit(p));
            if ((p as any).unavailable_dates) {
              setUnavailableDates((p as any).unavailable_dates);
            }
            setProfileImagePreview((p as any).profileimageurl || "");
            return;
          }
        }

        // If we reached here and didn't find anything, just clear profile
        if (!cancelled) {
          setProfile(null);
          setEditForm({});
          setProfileImagePreview("");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (!cancelled) {
          setProfile(null);
          setEditForm({});
          setProfileImagePreview("");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  // Helper to normalize DB object -> editable form keys (keeps original keys so saving is simple later)
  function normalizeForEdit(dbObj: any) {
    if (!dbObj) return {};
    const copy = { ...dbObj };

    // Ensure arrays are arrays (text[] in postgres may come as array)
    if (copy.providertype && !Array.isArray(copy.providertype)) {
      try {
        copy.providertype = JSON.parse(copy.providertype);
      } catch {
        copy.providertype =
          typeof copy.providertype === "string"
            ? copy.providertype.split(",").map((s: string) => s.trim())
            : [copy.providertype];
      }
    }
    if (copy.videourls && !Array.isArray(copy.videourls)) {
      try {
        copy.videourls = JSON.parse(copy.videourls);
      } catch {
        copy.videourls =
          typeof copy.videourls === "string"
            ? copy.videourls.split(",").map((s: string) => s.trim())
            : [copy.videourls];
      }
    }
    // services_pricing could be jsonb
    try {
      if (typeof copy.services_pricing === "string") {
        copy.services_pricing = JSON.parse(copy.services_pricing);
      }
    } catch {
      // leave as-is
    }
    return copy;
  }

  // When any field in editForm or unavailableDates or image preview changes, mark dirty
  useEffect(() => {
    // Compare editForm to profile deeply by JSON stringify (simple but effective for this UI)
    const clean = profile
      ? JSON.stringify(normalizeForEdit(profile))
      : JSON.stringify({});
    const edited = JSON.stringify(editForm || {});
    const calendarChanged =
      JSON.stringify(unavailableDates || []) !==
      JSON.stringify((profile as any)?.unavailable_dates || []);
    const imageChanged =
      (profileImagePreview || "") !== ((profile as any)?.profileimageurl || "");
    const changed = clean !== edited || calendarChanged || imageChanged;
    setHasChanges(changed);
  }, [editForm, unavailableDates, profileImagePreview, profile]);

  // Basic helpers for render
  const renderValue = (val: any) => {
    if (val === null || val === undefined) return "—";
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // Media render helpers
  const renderProfileImage = (url?: string | null) => {
    if (!url && !profileImagePreview) {
      return (
        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      );
    }
    return (
      <img
        src={profileImagePreview || (url ?? "")}
        alt={
          editForm?.providername || profile?.providername || "Provider image"
        }
        className="w-28 h-28 rounded-full object-cover border"
      />
    );
  };

  const isYouTube = (url: string) =>
    /youtube\.com\/watch|youtu\.be\//i.test(url);
  const isVimeo = (url: string) => /vimeo\.com\//i.test(url);

  const renderVideo = (url: string, idx: number) => {
    if (!url) return null;
    if (isYouTube(url)) {
      let id = "";
      const ytMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      if (ytMatch) id = ytMatch[1];
      const src = `https://www.youtube.com/embed/${id}`;
      return (
        <div key={idx} className="w-full sm:w-1/2">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={src}
              title={`video-${idx}`}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }
    if (isVimeo(url)) {
      return (
        <div key={idx} className="w-full sm:w-1/2">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={url}
              title={`video-${idx}`}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }
    return (
      <div key={idx} className="w-full sm:w-1/2">
        <video controls className="w-full rounded-lg bg-black">
          <source src={url} />
        </video>
      </div>
    );
  };

  // Handlers for inline edits
  const handleFieldChange = (key: string, rawValue: any) => {
    // For specific fields convert to expected types
    let value = rawValue;
    if (["yearsexperience"].includes(key)) {
      const num = Number(rawValue);
      value = Number.isNaN(num) ? null : num;
    }

    if (key === "providertype") {
      // allow comma-separated string -> array
      if (typeof rawValue === "string") {
        value = rawValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (key === "videourls") {
      if (typeof rawValue === "string") {
        value = rawValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (key === "services_pricing") {
      // Accept object or JSON string
      if (typeof rawValue === "string") {
        try {
          value = JSON.parse(rawValue);
          setFormErrors((prev) => ({ ...prev, services_pricing: "" }));
        } catch (e) {
          // Keep raw string in form but set error
          value = rawValue;
          setFormErrors((prev) => ({
            ...prev,
            services_pricing: "Invalid JSON",
          }));
        }
      }
    }

    setEditForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // Profile image change (only preview here)
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    // basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }
    try {
      const preview = URL.createObjectURL(file);
      setProfileImageFile(file);
      setProfileImagePreview(preview);
    } catch (err) {
      console.error("preview error", err);
    }
  };

  // Calendar availability handlers (these modify unavailableDates in local state)
  const handleAvailabilityType = (type: "home" | "away") => {
    if (!selectedDate) return;
    const newEntry = {
      date: selectedDate,
      type,
      city: type === "away" ? awayCity : undefined,
    };
    setUnavailableDates((prev) => {
      const upd = [
        ...prev.filter((p) => p.date !== selectedDate),
        newEntry,
      ].sort((a, b) => a.date.localeCompare(b.date));
      return upd;
    });
    setSelectedDate(null);
    setAwayMode(false);
    setAwayCity("");
  };

  // Allow removing unavailable date
  const handleRemoveUnavailable = (date: string) => {
    setUnavailableDates((prev) => prev.filter((d) => d.date !== date));
  };
const handleStageSave = async () => {
  if (!profile) {
    alert("❌ Profile not loaded. Please refresh and try again.");
    return;
  }

  console.log("🟡 Starting unified profile save...");

  try {
    const updatedFields: Partial<ProviderRow> = {};

    // 1️⃣ Detect text field changes
    for (const key of Object.keys(editForm) as (keyof ProviderRow)[]) {
      if (editForm[key] !== profile[key]) {
        updatedFields[key] = editForm[key];
      }
    }

    // 2️⃣ Upload new profile image (if selected)
    let newImageUrl: string | null = null;
    if (profileImageFile) {
      console.log("🟢 Uploading profile image...");

      const formData = new FormData();
      formData.append("file", profileImageFile);
      formData.append("providerId", profile.id.toString());

      const res = await fetch("/api/update_profile_image", {
        method: "POST",
        body: formData,
      });

      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        console.error("❌ Image upload failed:", result?.message);
        alert(result?.message || "Image upload failed.");
        return;
      }

      newImageUrl = result.url;
      updatedFields.profileimageurl = newImageUrl;
      console.log("✅ Image uploaded:", newImageUrl);
    }

    // 3️⃣ Upload pending videos (if any)
    let uploadedVideoUrls: string[] = [];
    if (pendingVideos.length > 0) {
      console.log("🎥 Uploading pending videos...");

      const existingVideos = profile.videourls || [];
      const availableSlots = 3 - existingVideos.length;

      if (availableSlots <= 0) {
        alert("⚠️ You already have 3 videos uploaded. Delete one to add more.");
      } else {
        const toUpload = pendingVideos.slice(0, availableSlots);

        for (const videoFile of toUpload) {
          const formData = new FormData();
          formData.append("file", videoFile);
          formData.append("providerId", profile.id.toString());

          const res = await fetch("/api/video_update", {
            method: "POST",
            body: formData,
          });

          const result = await res.json().catch(() => null);
          if (res.ok && result?.success) {
            console.log("✅ Video uploaded:", result.url);
            uploadedVideoUrls.push(result.url);
          } else {
            console.error("❌ Video upload failed:", result?.message);
          }
        }

        if (uploadedVideoUrls.length > 0) {
          updatedFields.videourls = [
            ...(profile.videourls || []),
            ...uploadedVideoUrls,
          ].slice(0, 3);
        }
      }
    }

    // 4️⃣ Skip update if nothing changed
    if (Object.keys(updatedFields).length === 0) {
      alert("ℹ️ No changes detected.");
      return;
    }

    // 5️⃣ Update database
    console.log("🟢 Saving updated profile data...");
    const res = await fetch("/api/update_provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: profile.id,
        updatedFields,
      }),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok || result?.error) {
      console.error("❌ DB update failed:", result?.error);
      alert(result?.error || "Failed to update profile.");
      return;
    }

    // 6️⃣ Update local state
    const updatedProfile = result.data?.[0] || {
      ...profile,
      ...updatedFields,
    };

    setProfile(updatedProfile);
    setProfileImageFile(null);
    setPendingVideos([]);
    setProfileImagePreview(newImageUrl ?? profile.profileimageurl ?? "");
    setHasChanges(false);

    console.log("✅ All changes saved:", updatedProfile);
    alert("🎉 All profile updates saved successfully!");
  } catch (err) {
    console.error("❌ handleStageSave error:", err);
    alert("Unexpected error while saving. Please try again later.");
  }
};





  // Helper to format date string for display
  const prettyDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });



  // Loading / not logged in handling
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading your dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <div className="text-center">
          <p className="mb-4 text-lg">
            You are not logged in or profile not found.
          </p>
          <a
            href="/provider-login"
            className="px-4 py-2 bg-[#a72c3e] text-white rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const validVideos = files.filter((file) => file.type.startsWith("video/"));

  if (validVideos.length === 0) {
    alert("Please select valid video files.");
    return;
  }

  if (validVideos.some((v) => v.size > 200 * 1024 * 1024)) {
    alert("⚠️ Each video must be under 200MB.");
    return;
  }

  setPendingVideos((prev) => [...prev, ...validVideos]);
  setHasChanges(true);
  alert(`🎥 Added ${validVideos.length} video(s) for upload. Click Save Changes to upload.`);
};




  // Everything below keeps your layout/design identical, but fields are now editable
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Provider Dashboard</h1>
              <p className="text-white/90 text-sm">
                Welcome back,{" "}
                {editForm?.providername ?? profile.providername ?? "Provider"}!
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-white/20 rounded-lg transition">
              <Bell className="w-5 h-5" />
            </button>
           
          </div>
        </div>
      </div>

      {/* Fixed Right Sidebar - Desktop (unchanged) */}
      <div className="hidden lg:block fixed right-8 top-1/3 z-40 space-y-3">
        <button
          onClick={() => {
            const el = document.getElementById("overview");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-300 shadow-lg ${
            activeSection === "overview"
              ? "bg-[#a72c3e] text-white translate-x-0"
              : "bg-white text-gray-700 hover:bg-gray-50 translate-x-2"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Overview</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById("calendar");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-300 shadow-lg ${
            activeSection === "calendar"
              ? "bg-[#a72c3e] text-white translate-x-0"
              : "bg-white text-gray-700 hover:bg-gray-50 translate-x-2"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Availability</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById("bookings");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-300 shadow-lg ${
            activeSection === "bookings"
              ? "bg-[#a72c3e] text-white translate-x-0"
              : "bg-white text-gray-700 hover:bg-gray-50 translate-x-2"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Bookings</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById("profile");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-300 shadow-lg ${
            activeSection === "profile"
              ? "bg-[#a72c3e] text-white translate-x-0"
              : "bg-white text-gray-700 hover:bg-gray-50 translate-x-2"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-semibold">Profile</span>
        </button>
      </div>

      {/* Bottom Nav - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex justify-around items-center py-3">
          <button
            onClick={() => {
              document
                .getElementById("overview")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
              activeSection === "overview" ? "text-[#a72c3e]" : "text-gray-600"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-semibold">Overview</span>
          </button>

          <button
            onClick={() => {
              document
                .getElementById("calendar")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
              activeSection === "calendar" ? "text-[#a72c3e]" : "text-gray-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold">Calendar</span>
          </button>

          <button
            onClick={() => {
              document
                .getElementById("bookings")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
              activeSection === "bookings" ? "text-[#a72c3e]" : "text-gray-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold">Bookings</span>
          </button>

          <button
            onClick={() => {
              document
                .getElementById("profile")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
              activeSection === "profile" ? "text-[#a72c3e]" : "text-gray-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-semibold">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 pb-32 lg:pb-8">
        {/* OVERVIEW */}
        <section id="overview" className="scroll-mt-24">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#a72c3e]" />
              Overview
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-[#a72c3e] hover:shadow-md transition">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">
                  Total Events
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#a72c3e]">
                  0
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-[#a72c3e] hover:shadow-md transition">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">
                  This Month
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#a72c3e]">
                  ₹0
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-[#a72c3e] hover:shadow-md transition">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">
                  Upcoming
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#a72c3e]">
                  0
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-[#a72c3e] hover:shadow-md transition">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Rating</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#a72c3e]">
                  0 ⭐
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 pb-2 border-b-2 border-[#a72c3e]/20">
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-100 transition border-l-4 border-[#a72c3e]"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.event}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {booking.client}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.date}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {booking.time}
                      </p>
                    </div>
                    <p className="font-bold text-[#a72c3e] text-base sm:text-lg">
                      {booking.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CALENDAR */}
        <section id="calendar" className="scroll-mt-24">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 flex items-center gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#a72c3e]" />
              Manage Availability
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 pb-4 border-b border-[#a72c3e]/20">
              Click future dates to mark as unavailable (shown in maroon)
            </p>

            {/* MODAL */}
            {selectedDate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] sm:w-[400px] relative">
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-semibold text-[#a72c3e] mb-4">
                    Set Availability for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h3>

                  {!awayMode ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAvailabilityType("home")}
                        className="py-2 rounded-lg bg-[#a72c3e] text-white font-semibold hover:bg-[#8b2332] transition"
                      >
                        Home Service
                      </button>
                      <button
                        onClick={() => setAwayMode(true)}
                        className="py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                      >
                        Away Service
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <AsyncPaginate
                        value={
                          awayCity ? { value: awayCity, label: awayCity } : null
                        }
                        loadOptions={loadCityOptions}
                        onChange={(selectedOption: any) => {
                          setAwayCity(
                            selectedOption ? selectedOption.value : ""
                          );
                        }}
                        placeholder="Search cities..."
                        additional={{ page: 1 }}
                        debounceTimeout={300}
                        isClearable
                        cacheUniqs={[awayCity]}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: "#d1d5db", // gray-300
                            borderWidth: "2px",
                            borderRadius: "0.5rem",
                            padding: "2px",
                            "&:hover": { borderColor: "#a72c3e" },
                            boxShadow: "none",
                          }),
                          option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#fce7eb" : "white",
                            color: isFocused ? "#a72c3e" : "black",
                          }),
                        }}
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAvailabilityType("away")}
                          disabled={!awayCity}
                          className="flex-1 py-2 rounded-lg bg-[#a72c3e] text-white font-semibold hover:bg-[#8b2332] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setAwayMode(false);
                            setAwayCity("");
                          }}
                          className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MONTH NAV */}
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <h3 className="text-lg sm:text-xl font-bold">
                  {monthNames[month]} {year}
                </h3>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* DAYS GRID */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-center font-semibold text-gray-600 py-2 text-xs sm:text-sm"
                  >
                    {d}
                  </div>
                ))}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(
                    2,
                    "0"
                  )}-${String(day).padStart(2, "0")}`;
                  const today = new Date();
                  const isPast =
                    new Date(dateStr) < new Date(today.setHours(0, 0, 0, 0));

                  // Find if this date has an unavailable entry
                  const entry = unavailableDates.find(
                    (d) => d.date === dateStr
                  );
                  const isUnavailable = Boolean(entry);
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === month &&
                    new Date().getFullYear() === year;

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      className={`relative aspect-square rounded-lg font-semibold transition text-sm sm:text-base flex flex-col items-center justify-center ${
                        isPast
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : isUnavailable
                          ? "bg-[#a72c3e] text-white hover:bg-[#8b2332]"
                          : isToday
                          ? "bg-[#a72c3e]/20 text-[#a72c3e] border-2 border-[#a72c3e]"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      {/* Day Number */}
                      <span className="text-base sm:text-lg font-bold">
                        {day}
                      </span>

                      {/* Show Home/Away and City info */}
                      {entry && (
                        <span
                          className={`text-[10px] sm:text-xs mt-1 text-center leading-tight ${
                            entry.type === "home"
                              ? "text-yellow-100"
                              : "text-gray-200"
                          }`}
                        >
                          {entry.type === "home" ? "Home" : "Away"}
                          <span className="block text-[9px] sm:text-[11px] opacity-90">
                            {entry.type === "home"
                              ? profile?.servicearea || "My City"
                              : entry.city || ""}
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BOOKINGS */}
        <section id="bookings" className="scroll-mt-24">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 pb-2 border-b-2 border-[#a72c3e]/20 flex items-center gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#a72c3e]" /> All
              Bookings
            </h2>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 sm:p-5 border-2 border-gray-200 rounded-lg hover:border-[#a72c3e] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <p className="font-bold text-base sm:text-lg text-gray-900">
                        {booking.event}
                      </p>
                      <p className="text-sm text-gray-600">{booking.client}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#a72c3e]/10 text-[#a72c3e] rounded-full text-xs sm:text-sm font-semibold self-start">
                      Confirmed
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {booking.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">
                        {booking.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold text-[#a72c3e]">
                        {booking.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROFILE */}
  <section id="profile" className="scroll-mt-24 py-6">
  <div className="space-y-6">
    {/* Profile Header */}
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          {renderProfileImage(profile.profileimageurl)}
          <div>
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
    <User className="w-6 h-6 text-[#a72c3e]" />
    <span className="font-semibold text-gray-900">
      {profile.providername || "Unnamed Provider"}
    </span>
  </h2>

  {/* ✅ Editable Short Description */}
  <div className="mt-1">
    <input
      type="text"
      value={
        editForm?.shortdescription ?? profile.shortdescription ?? ""
      }
      onChange={(e) =>
        handleFieldChange("shortdescription", e.target.value)
      }
      placeholder="Write a short description..."
      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-gray-700 text-sm focus:ring-2 focus:ring-[#a72c3e] focus:outline-none transition-all"
    />
  </div>

  {/* Non-editable contact info */}
  <p className="text-sm text-gray-600 mt-2 flex flex-wrap gap-x-2">
    <span className="text-gray-800 font-medium">
      📞 {profile.contactphone || "No phone available"}
    </span>
    ·
    <span className="text-gray-800 font-medium">
      ✉️ {profile.contactemail || "No email available"}
    </span>
  </p>
</div>

        </div>

        {/* Change Photo */}
        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-[#a72c3e]/10 text-[#a72c3e] border border-[#a72c3e]/20 hover:bg-[#a72c3e]/20 transition text-sm font-medium">
          <Upload className="w-4 h-4" />
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Editable Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {[
    "providertype",
    "qualification",
    "institute",
    "servicearea",
    "yearsexperience",
    "servicesoffered",
  ].map((key) => {
    const isEditable = ["qualification", "institute", "servicearea", "yearsexperience"].includes(key);

    return (
      <div key={key}>
        <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
          {key.replace(/([A-Z])/g, " $1")}
        </label>

        {isEditable ? (
          // ✅ Editable fields
          <input
            type="text"
            value={editForm?.[key] ?? (profile as any)?.[key] ?? ""}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#a72c3e] focus:outline-none text-sm"
          />
        ) : (
          <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-not-allowed">
            {(profile as any)?.[key] || "Not provided"}
          </div>
        )}
      </div>
    );
  })}


     {/* Services & Pricing */}
<div className="md:col-span-2">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Services & Pricing</h3>

  {/* If there's no services_pricing or it's empty */}
  {!editForm?.services_pricing ||
  (Object.keys(editForm.services_pricing).length === 0 &&
    (editForm.services_pricing === null || editForm.services_pricing === undefined)) ? (
    <p className="text-gray-500 italic">No service pricing data available.</p>
  ) : (
    <div className="space-y-5">
      {["individual", "group"].map((category) => {
        const services = Array.isArray(editForm.services_pricing?.[category])
          ? editForm.services_pricing[category]
          : [];

        return (
          <div key={category} className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
            <h4 className="text-base font-semibold text-[#a72c3e] mb-3 border-b border-gray-200 pb-1 capitalize">
              {category}
            </h4>

            {services.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No services listed under {category}.</p>
            ) : (
              <div className="space-y-3">
                {services.map((srv: any, i: number) => {
                  // Normalized fields from your sample JSON
                  const name = srv?.service ?? srv?.name ?? `Service ${i + 1}`;
                  const price = srv?.price ?? "";

                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">{name}</div>
                        {/* show includes subtitles for group */}
                        {category === "group" && srv?.includes && (
                          <div className="text-xs text-gray-500 mt-1">Includes: {srv.includes}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder="₹ Price"
                          value={String(price)}
                          onChange={(e) => {
                            const newPrice = e.target.value;

                            // Create a deep copy of current services_pricing and update the specific price
                            const updatedPricing = {
                              ...(editForm.services_pricing || {}),
                            };

                            // Ensure category array exists
                            updatedPricing[category] = Array.isArray(updatedPricing[category])
                              ? [...updatedPricing[category]]
                              : [];

                            // Normalize each item to object shape (in case stored as arrays)
                            const currItem = updatedPricing[category][i] ?? {};
                            // If stored as array [service, price], convert to object
                            let normalized =
                              Array.isArray(currItem) && currItem.length >= 2
                                ? { service: currItem[0], price: currItem[1], includes: currItem[2] }
                                : { ...(currItem || {}) };

                            normalized.price = newPrice;
                            // Put back normalized object
                            updatedPricing[category][i] = normalized;

                            handleFieldChange("services_pricing", updatedPricing);
                          }}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:border-[#a72c3e] focus:outline-none text-sm text-center"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</div>


        {/* Videos */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Videos
          </label>
          <div className="flex flex-wrap gap-4">
            {(editForm?.videourls ?? profile?.videourls ?? []).map(
              (v: string, idx: number) => (
                <div key={idx} className="relative w-40 h-24">
                  {renderVideo(v, idx)}
                  <button
                    onClick={() => {
                      const newVideos = (
                        editForm?.videourls ?? profile?.videourls ?? []
                      ).filter((_: any, i: number) => i !== idx);
                      handleFieldChange("videourls", newVideos);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )
            )}
            <label className="cursor-pointer flex items-center justify-center w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#a72c3e] transition">
  <Upload className="w-6 h-6 text-gray-500" />
  <input
    type="file"
    accept="video/*"
    onChange={handleVideoSelect}
    className="hidden"
  />
</label>

          </div>
        </div>
      </div>
    </div>

    
  </div>
</section>

      </div>

      {/* FLOATING SAVE BUTTON (visible only when hasChanges true) */}
      {hasChanges && (
        <div className="fixed right-6 bottom-6 z-50">
          <button
            onClick={handleStageSave}
            className="flex items-center gap-3 px-4 py-3 bg-[#a72c3e] text-white rounded-2xl shadow-lg hover:bg-[#8b2332] transition font-semibold"
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}
