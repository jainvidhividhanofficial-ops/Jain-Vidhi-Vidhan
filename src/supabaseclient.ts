// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Make sure these are defined in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
}

// ✅ Stable client instance with helpful defaults
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Prevents stale sessions in Next.js
  },
  global: {
    headers: {
      "x-client-info": "jain-vidhi-platform", // Optional custom identifier
    },
  },
});

/**
 * Helper to fix broken image/video URLs if they still point to the old Supabase project.
 * Also handles relative filenames by prepending the new Supabase storage path.
 */
export function fixSupabaseUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "";

  const trimmedUrl = url.trim();
  const oldProjectUrl = "https://yapekidgvbwydjqyonzk.supabase.co";
  const newProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bvewmktjfjepedwevmcz.supabase.co";

  // 1. If it's an absolute URL
  if (trimmedUrl.startsWith("http")) {
    if (trimmedUrl.includes(oldProjectUrl)) {
      return trimmedUrl.replace(oldProjectUrl, newProjectUrl);
    }
    return trimmedUrl;
  }

  // 2. If it's a relative path starting with / (likely local public assets)
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  // 3. If it's just a filename (e.g., "myphoto.jpg"), assume it's in Supabase Storage
  // Profile images go to 'image' bucket, videos to 'video' bucket
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(trimmedUrl);
  const bucket = isVideo ? "video" : "image";

  // Clean up the project URL to ensure no trailing slash
  const baseUrl = newProjectUrl.endsWith("/") ? newProjectUrl.slice(0, -1) : newProjectUrl;

  // Encode the filename only, not the whole path
  return `${baseUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(trimmedUrl)}`;
}



