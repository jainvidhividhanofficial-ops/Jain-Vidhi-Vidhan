'use client';

import { fixSupabaseUrl } from "@/supabaseclient";
import { motion } from "framer-motion";
import { CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";


export interface Provider {
  id: string;
  providername: string;
  providertype: string | string[];
  profileimageurl?: string;
  profileImageUrl?: string;
  verified?: boolean;
  yearsexperience?: number;
  shortdescription?: string;
  servicearea?: string;
  services_pricing?: { service: string }[];
}

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const allTypes = Array.isArray(provider.providertype)
    ? provider.providertype
    : typeof provider.providertype === "string"
      ? provider.providertype.replace(/[\[\]"]+/g, "").split(",").map(t => t.trim()).filter(Boolean)
      : [];

  const typeString = allTypes.join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-[#fdf9f6] border border-[#e5d5c8] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col relative overflow-hidden h-full"
    >
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a72c3e] via-[#b84a4f] to-[#a72c3e]" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3 mt-1">
        <div className="flex items-center gap-3">
          <img
             src={fixSupabaseUrl(provider.profileimageurl || provider.profileImageUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.providername)}&background=a72c3e&color=fff`}
            alt={provider.providername}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#d7b899] shadow-sm"
          />
          <div>
            <h3 className="text-base font-semibold text-gray-900 font-serif tracking-wide truncate max-w-[150px]">
              {provider.providername}
            </h3>
            {provider.yearsexperience && (
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{provider.yearsexperience} years exp.</p>
            )}
          </div>
        </div>

        {/* Verified Badge */}
        {provider.verified && (
          <span className="flex items-center gap-1 bg-[#f3f0eb] text-[#3b7a57] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c5b8a2]">
            <CheckCircle className="w-3 h-3 text-[#3b7a57]" />
            Verified
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#e7d7c6] my-2" />

      {/* Categories / Types - Showing all once here to remove confusion */}
      <p className="text-xs text-[#a72c3e] font-semibold mb-2 line-clamp-1">
        {typeString || "Service Provider"}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 leading-snug line-clamp-2 italic">
        "{provider.shortdescription ||
          "Experienced professional offering authentic and meaningful Jain services."}"
      </p>

      <div className="mt-auto space-y-3">
        {/* Location */}
        <div className="flex items-center text-xs text-gray-600 gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#a67c52]" />
          <span className="truncate">{provider.servicearea || "Location not specified"}</span>
        </div>

        {/* Button */}
        <Link
          href={`/serviceproviders/${provider.id}`}
          className="block w-full bg-[#a72c3e] hover:bg-[#8c2332] text-white text-sm font-semibold py-2.5 rounded-lg text-center transition-all duration-200 tracking-wide shadow-sm"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}



interface ProvidersComponentProps {
  providers: Provider[];
}

export default function ProvidersComponent({ providers }: ProvidersComponentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
