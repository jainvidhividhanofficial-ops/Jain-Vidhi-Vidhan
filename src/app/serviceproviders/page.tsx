'use client';

import FilterBar from "@/component/filter";
import { Provider, ProviderCard } from "@/component/provider/card";
import ServiceProvidersTypes from "@/component/provider/serviceproviderstypes";
import WhyUs from "@/component/provider/whyus";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const providerFilters = useMemo(() => [
    {
      label: "Type",
      options: [
        "Pooja & Vidhan",
        "Bhajan Sandhya",
        "Chakravarty Vivah",
        "Panchkalyanak",
        "Graha Pravesh",
        "Bhumi Poojan",
        "Shilanayas",
        "Musical Phere",
        "Anchor",
        "Singer",
      ],
    },
    {
      label: "Location",
      options: [
        "Delhi",
        "Mumbai",
        "Bangalore",
        "Kolkata",
        "Chennai",
        "Pune",
        "Hyderabad",
        "Jaipur",
        "Ahmedabad",
        "Indore",
      ],
    },
  ], []);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("providers")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedData: Provider[] = (data || []).map((p: any) => ({
          ...p,
          id: String(p.id),
          providername: p.providername || "",
          providertype: (() => {
            const raw1 = p.providertype;
            const raw2 = p.providerType;
            
            // Helper to see if "raw" has anything useful
            const getArray = (raw: any): string[] => {
              if (Array.isArray(raw)) return raw.filter(Boolean).map(t => String(t).trim());
              if (typeof raw === "string" && raw.trim()) {
                return raw.replace(/[\[\]"]+/g, "").split(",").map(t => t.trim()).filter(Boolean);
              }
              return [];
            };

            const arr1 = getArray(raw1);
            const arr2 = getArray(raw2);
            
            // Return whichever one has more data, or an empty array
            return arr1.length >= arr2.length ? arr1 : arr2;
          })(),
          servicearea: p.servicearea || p.serviceArea || "",
          rating: p.rating || 0,
          yearsexperience: p.yearsexperience || p.yearsExperience || 0,
          shortdescription: p.shortdescription || p.shortDescription || "",
        }));

        setProviders(formattedData);
        setFilteredProviders(formattedData);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        // Keep loader on screen long enough for brand impact
        setTimeout(() => setLoading(false), 1500);
      }
    }

    fetchProviders();
  }, []);

  const handleResultsChange = useCallback((results: Provider[]) => {
    setFilteredProviders(results);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#a72c3e] to-[#8b2332] text-white text-center pt-36 md:pt-40 pb-24 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Verified Service Providers
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
          Connect with experienced and trusted professionals for your Jain religious and cultural events.
          All providers are verified and rated by our community.
        </p>
      </section>

      {/* Filter Section */}
      <FilterBar
        pageType="providers"
        searchPlaceholder="Search providers by name..."
        filters={providerFilters}
        items={providers}
        searchableKey="providername"
        onResultsChange={handleResultsChange}
      />

      {/* ✨ Branded Loading Overlay */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-[#fff8f7] via-[#fef4ec] to-[#ffeaea] relative overflow-hidden"
        >
          {/* Floating Glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] bg-[#a72c3e]/10 rounded-full blur-3xl -top-40 left-1/2 -translate-x-1/2"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Rotating Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 mb-6 z-10"
          >
            <Image
              src="/vvi.png"
              alt="Nirgranth Creation"
              width={128}
              height={128}
              className="object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Marketing Text (Dopamine Hooks) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center px-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#a72c3e] mb-2 tracking-wide">
              Greatness takes a moment...
            </h2>
            <p className="text-sm sm:text-base text-gray-600 italic mb-3">
              We’re handpicking verified Jain professionals for your event ✨
            </p>
            <motion.p
              className="text-[#8b2332] font-medium text-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Building trust, one click at a time ⏳
            </motion.p>
          </motion.div>

          {/* Motivational Hook (delayed) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 text-xs sm:text-sm text-gray-500 italic"
          >
            “People who wait here usually find the perfect match 💫”
          </motion.div>
        </motion.div>
      ) : (
        <>
          {/* Providers Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
            <p className="text-gray-600 font-medium">
              Showing {filteredProviders.length} of {providers.length} providers
            </p>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">
                No providers found matching your search or filters.
              </p>
              <button
                onClick={() => setFilteredProviders(providers)}
                className="px-6 py-2 bg-[#a72c3e] text-white rounded-lg hover:bg-[#8b2332] transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ServiceProvidersTypes />
      <WhyUs />
    </main>
  );
}
