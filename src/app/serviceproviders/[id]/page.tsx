// ProviderProfilePage.tsx
"use client";

import { fixSupabaseUrl } from "@/supabaseclient";
import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    Briefcase,
    Download,
    Facebook,
    GraduationCap,
    Instagram,
    Linkedin,
    MapPinned,
    Phone,
    PlayCircle,
    Share2,
    Twitter,
    User,
    Users,
    X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

/**
 * ProviderProfilePage
 *
 * - Preserves your original card layout and visuals.
 * - Adds an improved toggle switch directly inside the card (only once).
 * - Removes duplicate toggle from the modal (no repeated selection).
 *
 * Notes:
 * - Keep your NEXT_PUBLIC_SUPABASE_* env vars set.
 * - Hook booking confirm to your backend / supabase booking table as needed.
 */

// ------------------------
// Supabase client
// ------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ------------------------
// Lightweight types
// ------------------------
type PriceEntry = { service: string; price: string | number; includes?: string };
type ServicesPricingShape = {
  individual?: PriceEntry[];
  group?: PriceEntry[];
};

// ------------------------
// Small helper components
// ------------------------

// Improved responsive inline toggle (fixed truncation issue)
function BookingTypeToggle({
  mode,
  setMode,
}: {
  mode: "individual" | "group";
  setMode: (m: "individual" | "group") => void;
}) {
  // keyboard handler for accessibility
  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>, value: "individual" | "group") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMode(value);
    }
  };

  return (
    // width tuned to fit "Individual" fully on mobile & desktop, but responsive
    <div className="relative flex items-center bg-white rounded-full border border-orange-200 shadow-inner overflow-hidden w-[260px] sm:w-[340px]">
      {/* sliding highlight */}
      <motion.div
        layout
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#a72c3e] to-[#8b2332] shadow"
        style={{
          left: mode === "individual" ? 6 : "calc(50% + 6px)",
          width: "calc(50% - 12px)",
        }}
      />

      <button
        role="tab"
        aria-selected={mode === "individual"}
        onClick={() => setMode("individual")}
        onKeyDown={(e) => handleKey(e, "individual")}
        className={`relative z-10 flex items-center justify-center gap-2 px-3 py-2 text-sm sm:text-base font-semibold transition-colors ${
          mode === "individual" ? "text-white" : "text-[#a72c3e]"
        }`}
        style={{ flex: 1, minWidth: "max-content" }}
      >
        <User className="w-4 h-4" />
        <span className="whitespace-nowrap">Individual</span>
      </button>

      <button
        role="tab"
        aria-selected={mode === "group"}
        onClick={() => setMode("group")}
        onKeyDown={(e) => handleKey(e, "group")}
        className={`relative z-10 flex items-center justify-center gap-2 px-3 py-2 text-sm sm:text-base font-semibold transition-colors ${
          mode === "group" ? "text-white" : "text-[#a72c3e]"
        }`}
        style={{ flex: 1, minWidth: "max-content" }}
      >
        <Users className="w-4 h-4" />
        <span className="whitespace-nowrap">Group</span>
      </button>
    </div>
  );
}

// ------------------------
// Main component
// ------------------------
export default function ProviderProfilePage() {
  const { id } = useParams(); // id from route
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // UI state
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Booking state
  const [mode, setMode] = useState<"individual" | "group">("individual"); // main toggle
  const [selectedService, setSelectedService] = useState<string>("");

  // Fetch provider
  useEffect(() => {
    async function fetchProvider() {
      try {
        if (!id) return;
        const { data, error } = await supabase.from("providers").select("*").eq("id", id).single();
        if (error) {
          console.error("Error fetching provider:", error);
          setProvider(null);
        } else {
          setProvider(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProvider();
  }, [id]);

  // ------------------------
  // Parse services_pricing (safe)
  // ------------------------
  const servicesPricing: ServicesPricingShape = useMemo(() => {
    if (!provider) return {};
    const raw =
      provider.services_pricing ?? provider.servicesPrincing ?? provider.servicesPricing ?? provider.services ?? null;
    if (!raw) return {};

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object") return parsed;
      } catch (e) {
        // fallback naive parse
        try {
          const lines = raw.split("\n").map((l: string) => l.trim()).filter(Boolean);
          const individual: PriceEntry[] = [];
          lines.forEach((ln) => {
            const parts = ln.split("-").map((p) => p.trim());
            if (parts.length >= 2) {
              individual.push({ service: parts[0], price: parts[1] });
            }
          });
          if (individual.length) return { individual };
        } catch {}
        console.warn("services_pricing string parse failed", e);
        return {};
      }
    }

    if (Array.isArray(raw)) {
      return { individual: raw };
    }

    if (typeof raw === "object") {
      const normalized: ServicesPricingShape = {};
      if (Array.isArray((raw as any).individual)) normalized.individual = (raw as any).individual;
      if (Array.isArray((raw as any).group)) normalized.group = (raw as any).group;

      if (!normalized.individual && !normalized.group) {
        const arrs = Object.values(raw).find((v) => Array.isArray(v));
        if (arrs) {
          normalized.individual = arrs as PriceEntry[];
        } else {
          const guess: PriceEntry[] = Object.keys(raw).map((k) => ({
            service: k,
            price: (raw as any)[k],
          }));
          if (guess.length > 0) normalized.individual = guess;
        }
      }
      return normalized;
    }

    return {};
  }, [provider]);

  const individualPricing: PriceEntry[] = Array.isArray(servicesPricing.individual) ? servicesPricing.individual : [];
  const groupPricing: PriceEntry[] = Array.isArray(servicesPricing.group) ? servicesPricing.group : [];

  // combined for legacy UI parts which may expect a list
  const combinedPricing: PriceEntry[] =
    individualPricing.length > 0 || groupPricing.length > 0
      ? [...individualPricing, ...groupPricing.filter((g) => !individualPricing.some((i) => i.service === g.service))]
      : Array.isArray(provider?.services_pricing)
      ? provider.services_pricing
      : [];

  const pricingForDisplay = combinedPricing;

  // ensure selectedService auto-selects first available for mode when modal opens or mode changes
  const servicesForMode: PriceEntry[] = mode === "individual" ? individualPricing : groupPricing;

  useEffect(() => {
    if (showModal) {
      if (servicesForMode.length === 1) {
        setSelectedService(servicesForMode[0].service);
      } else if (servicesForMode.length > 1) {
        if (!servicesForMode.some((s) => s.service === selectedService)) {
          setSelectedService(servicesForMode[0]?.service ?? "");
        }
      } else {
        setSelectedService("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, showModal]);

  useEffect(() => {
    if (!showModal) return;
    if (!selectedService && servicesForMode.length === 1) {
      setSelectedService(servicesForMode[0].service);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, servicesForMode]);

  // ------------------------
  // Utility functions
  // ------------------------
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n: string) => (n ? n[0] : ""))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // share handler
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${provider?.providername ?? "this provider"} on Jain Vidhi Vidhan`;

    const shareUrls: any = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      instagram: `https://www.instagram.com/`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
    setShowShareMenu(false);
  };

  // download visiting card
  const handleDownload = async () => {
    const card = document.getElementById("visiting-card-download");
    if (!card) {
      alert("Card element not found!");
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;

      // Clone the card so we can safely modify it for clean export
      const clonedCard = card.cloneNode(true) as HTMLElement;

      // Make clone visually neutral (for export)
      clonedCard.style.background = "#ffffff";
      clonedCard.style.color = "#000000";
      clonedCard.style.boxShadow = "0 0 20px rgba(0,0,0,0.08)";
      clonedCard.style.border = "1px solid #e5e7eb";
      clonedCard.style.padding = "20px";
      clonedCard.style.borderRadius = "12px";
      clonedCard.style.width = "fit-content";
      clonedCard.style.fontFamily = "sans-serif";

      clonedCard.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement;
        element.style.background = "none";
        element.style.backgroundImage = "none";
        element.style.color = "#000000";
        element.style.borderColor = "#e5e7eb";
        element.style.boxShadow = "none";
      });

      // place offscreen
      clonedCard.style.position = "fixed";
      clonedCard.style.top = "-9999px";
      clonedCard.style.left = "-9999px";
      clonedCard.style.zIndex = "-1";
      document.body.appendChild(clonedCard);

      const canvas = await html2canvas(clonedCard, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      } as any);

      document.body.removeChild(clonedCard);

      const link = document.createElement("a");
      link.download = `${provider?.providername ?? "VisitingCard"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed — please try again.");
    }
  };

  // Book button opens modal - IMPORTANT: do NOT override user's chosen `mode`
  const handleBook = () => {
    // Preserve whatever mode the user already selected.
    // If nothing selected, default to current state (already set to 'individual' initially).
    setSelectedService("");
    setShowModal(true);
  };

  // Confirm booking - navigate to information form
  const handleConfirmBooking = async () => {
    if (servicesForMode.length > 1 && !selectedService) {
      return;
    }

    const serviceName = selectedService || (servicesForMode.length === 1 ? servicesForMode[0].service : "");
    
    // Navigate to booking form with details
    router.push(`/booking?type=provider&id=${id}&service=${encodeURIComponent(serviceName)}&providerName=${encodeURIComponent(provider.providername)}`);
  };

  // ------------------------
  // Render states
  // ------------------------
  if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff9f5] via-[#fff3ef] to-[#ffe9e2] relative overflow-hidden text-center">
      {/* Subtle Animated Gradient Background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[#ffe5db] via-[#fff1ec] to-[#ffd9ce] opacity-70 bg-[length:200%_200%] z-0"
      />

      {/* Rotating Logo */}
      <motion.img
        src="/vvi.png"
        alt="Nirgranth Creation"
        className="w-24 h-24 sm:w-28 sm:h-28 mb-6 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Marketing Hook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="z-10 px-6"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-[#a72c3e] mb-2 tracking-wide">
          Discovering Authentic Jain Excellence...
        </h2>
        <p className="text-sm sm:text-base text-gray-600 italic">
          Verified. Trusted. Handpicked for your peace of mind.
        </p>
      </motion.div>

      {/* Pulse Line (Visual cue for anticipation) */}
      <motion.div
        animate={{ scaleX: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-32 h-[2px] mt-6 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] rounded-full z-10"
      />

      {/* Subtle Bottom Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-xs sm:text-sm text-gray-500 font-medium tracking-wide z-10"
      >
        ✦ Curated with <span className="text-[#a72c3e] font-semibold">Nirgranth Precision</span> ✦
      </motion.p>
    </div>
  );
}


  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border-4 border-[#a72c3e]">
          <p className="text-gray-600 text-lg">Provider not found.</p>
        </div>
      </div>
    );
  }

  // providerTypes parsing
  const providerTypes = Array.isArray(provider.providertype)
    ? provider.providertype.map((t: string) => t.replace(/[\[\]"]+/g, "").trim())
    : typeof provider.providertype === "string"
    ? provider.providertype
        .replace(/[\[\]"]+/g, "")
        .split(",")
        .map((t: string) => t.trim())
    : [];

  const pricing = Array.isArray(provider.services_pricing) ? provider.services_pricing : combinedPricing;

  // ------------------------
  // JSX
  // ------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-32 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Floating share + download */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold border border-amber-200 text-sm"
            aria-haspopup="true"
            aria-expanded={showShareMenu}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#a72c3e] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold border-2 border-[#a72c3e] text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>
        </div>

        {/* Share Menu */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-white rounded-xl shadow-2xl p-4 border-2 border-amber-200"
            >
              <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">Share on Social Media</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare("twitter")}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-sky-50 rounded-lg transition border border-transparent hover:border-sky-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg">
                    <Twitter className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">LinkedIn</span>
                </button>

                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-green-50 rounded-lg transition border border-transparent hover:border-green-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visiting Card */}
        <motion.div
          id="visiting-card-download"
          initial={{ opacity: 0, rotateY: -10 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 rounded-2xl shadow-2xl overflow-hidden border-4 border-double border-[#a72c3e]"
        >
          {/* Ornamental svgs */}
          <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#a72c3e] opacity-20">
              <path d="M 0 0 Q 50 0 50 50 Q 50 0 100 0" fill="currentColor" />
              <path d="M 0 0 Q 0 50 50 50 Q 0 50 0 100" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#a72c3e] opacity-20">
              <path d="M 0 0 Q 50 0 50 50 Q 50 0 100 0" fill="currentColor" />
              <path d="M 0 0 Q 0 50 50 50 Q 0 50 0 100" fill="currentColor" />
            </svg>
          </div>

          {/* Mandala background pattern (kept) */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mandala" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#a72c3e" strokeWidth="2" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#a72c3e" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#a72c3e" strokeWidth="1" />
                  <circle cx="100" cy="100" r="20" fill="none" stroke="#a72c3e" strokeWidth="0.5" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={100 + 80 * Math.cos((angle * Math.PI) / 180)}
                      y2={100 + 80 * Math.sin((angle * Math.PI) / 180)}
                      stroke="#a72c3e"
                      strokeWidth="0.5"
                    />
                  ))}
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mandala)" />
            </svg>
          </div>

          {/* Card content */}
          <div className="relative p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-amber-300 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-1 h-6 bg-gradient-to-b from-transparent via-[#a72c3e] to-transparent" />
                <h2
                  className="text-xl md:text-2xl font-bold text-[#a72c3e] tracking-wider"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  JAIN VIDHI VIDHAN
                </h2>
                <div className="w-1 h-6 bg-gradient-to-b from-transparent via-[#a72c3e] to-transparent" />
              </div>
              <p className="text-xs text-gray-600 italic tracking-wide">Sacred Traditions • Modern Excellence</p>
            </div>

            {/* Main grid */}
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Left: avatar + years */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-[#a72c3e] rounded-full blur-md opacity-50" />
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 p-1 shadow-2xl">
                    {(provider.profileimageurl || provider.profileImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fixSupabaseUrl(provider.profileimageurl || provider.profileImageUrl)}
                        alt={provider?.providername ?? "Provider"}
                        className="w-full h-full rounded-full object-cover border-3 border-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#a72c3e] to-[#8b2332] flex items-center justify-center text-3xl font-bold text-white border-3 border-white">
                        {getInitials(provider.providername)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>

                {/* years badge */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl px-4 py-2 border-2 border-amber-300 shadow-lg">
                  <p className="text-2xl font-bold text-[#a72c3e]" style={{ fontFamily: "Georgia, serif" }}>
                    {provider.yearsexperience || 0}
                  </p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Years Experience</p>
                </div>
              </div>

              {/* Center & right: main info */}
              <div className="md:col-span-2 space-y-3">
                {/* name & desc */}
                <div className="border-l-4 border-[#a72c3e] pl-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    {provider.providername}
                  </h1>
                  <p className="text-sm text-gray-600 italic leading-relaxed">{provider.shortdescription}</p>
                </div>

                {/* expertise */}
                {providerTypes.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border-2 border-amber-200">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[#a72c3e] mb-2 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {providerTypes.map((spec: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white text-[#a72c3e] rounded-full text-xs font-semibold border border-[#a72c3e]/30 capitalize shadow-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* location */}
                  {provider.servicearea && (
                    <div className="bg-white rounded-lg p-3 border-2 border-blue-200 shadow-md">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPinned className="w-3.5 h-3.5 text-[#a72c3e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Location</p>
                          <p className="text-xs font-bold text-gray-900">{provider.servicearea}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* services count */}
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-200 shadow-md">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-3.5 h-3.5 text-[#a72c3e]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Services</p>
                        <p className="text-xs font-bold text-gray-900">{pricing.length} Available</p>
                      </div>
                    </div>
                  </div>

                  {/* qualification */}
                  {provider.qualification && (
                    <div className="bg-white rounded-lg p-3 border-2 border-green-200 shadow-md sm:col-span-2">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-3.5 h-3.5 text-[#a72c3e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Education</p>
                          <p className="text-xs font-bold text-gray-900">{provider.qualification}</p>
                          {provider.institute && <p className="text-xs text-gray-600 italic mt-0.5">{provider.institute}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing preview with the new toggle */}
                {provider.services_pricing && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-[#a72c3e]">Service Charges</h3>
                      {/* NEW: Single Toggle - user sees only here */}
                      <BookingTypeToggle mode={mode} setMode={setMode} />
                    </div>

                    {/* Individual */}

                    {mode === "individual" && individualPricing && individualPricing.length > 0 ? (
                      <div className="mb-3">
                        <h4 className="text-[13px] font-bold text-[#a72c3e] mb-1">Individual Rates</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {individualPricing.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white/80 rounded-lg px-2 py-1.5 border border-orange-200">
                              <p className="text-xs text-gray-600 capitalize truncate">{item.service}</p>
                              <p className="text-sm font-bold text-[#a72c3e]">₹{item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : mode === "individual" ? (
                      <p className="text-xs text-gray-500 mb-3">No individual rates listed.</p>
                    ) : null}

                    {/* Group */}
                    {mode === "group" && groupPricing && groupPricing.length > 0 ? (
                      <div>
                        <h4 className="text-[13px] font-bold text-[#a72c3e] mb-1">Group Rates</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {groupPricing.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white/80 rounded-lg px-2 py-1.5 border border-orange-200">
                              <p className="text-xs text-gray-600 capitalize truncate">{item.service}</p>
                              <p className="text-sm font-bold text-[#a72c3e]">₹{item.price}</p>
                              {item.includes && <p className="text-[10px] text-gray-500 italic truncate">Includes: {item.includes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : mode === "group" ? (
                      <p className="text-xs text-gray-500">No group rates listed.</p>
                    ) : null}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleBook}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-amber-300"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>

            {/* Footer small */}
            <div className="mt-6 pt-4 border-t-2 border-amber-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 bg-gradient-to-br from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl">
                    <Instagram className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs font-bold text-[#a72c3e]">JainEvent.com</p>
                  <p className="text-xs text-gray-500 italic">Connecting Traditions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video section */}
        {provider.videourls && provider.videourls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white rounded-xl shadow-xl p-4 border-2 border-amber-200"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#a72c3e]" />
              Sample Work & Portfolio
            </h3>

            <video controls className="w-full rounded-lg shadow-lg border-2 border-gray-200" style={{ maxHeight: "250px" }}>
              <source src={fixSupabaseUrl(provider.videourls[0])} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </div>

      {/* Booking modal - note: no duplicate mode toggle inside (user asked) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !bookingSuccess && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative border-2 border-amber-300"
            >
              {/* close */}
              {!bookingSuccess && (
                <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              )}

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    Booking Confirmed!
                  </h3>
                  <p className="text-sm text-gray-600">Successfully booked {selectedService ? `(${selectedService}) ` : ""}with {provider.providername}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#a72c3e] to-[#8b2332] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                      Book Service
                    </h3>
                    {/* show currently selected mode clearly */}
                    <p className="text-sm text-gray-600 mt-1">
                      Mode: <strong className="text-gray-800">{mode === "individual" ? "Individual" : "Group"}</strong>
                    </p>
                  </div>

                  {/* Service selection - displays services for currently selected mode */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Select Service</label>

                    {servicesForMode.length === 0 ? (
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">
                        No {mode} services listed. Please switch type on the main card or contact the provider.
                      </div>
                    ) : servicesForMode.length === 1 ? (
                      <div className="mb-3 p-4 bg-gradient-to-br from-[#a72c3e]/10 to-[#8b2332]/10 rounded-lg border-2 border-[#a72c3e]/30 text-center">
                        <p className="text-sm text-gray-700 font-semibold mb-1">{servicesForMode[0].service}</p>
                        <p className="text-2xl font-bold text-[#a72c3e]">₹{servicesForMode[0].price}</p>
                        {mode === "group" && servicesForMode[0].includes && (
                          <p className="text-xs text-gray-500 italic mt-1">Includes: {servicesForMode[0].includes}</p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">Automatically selected</div>
                      </div>
                    ) : (
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full border-2 border-[#a72c3e] rounded-lg p-3 text-sm focus:ring-4 focus:ring-[#a72c3e]/20 focus:border-[#a72c3e] outline-none transition"
                      >
                        <option value="">-- Choose a service --</option>
                        {servicesForMode.map((item: any, idx: number) => (
                          <option key={idx} value={item.service}>
                            {item.service} — ₹{item.price}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    disabled={servicesForMode.length > 1 && !selectedService}
                    onClick={handleConfirmBooking}
                    className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-300 ${
                      servicesForMode.length > 1 && !selectedService
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white hover:shadow-xl hover:scale-105 border-2 border-amber-300"
                    }`}
                  >
                    Confirm Booking {selectedService ? `( ${selectedService} )` : ""}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
