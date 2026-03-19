"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force scroll reset after route change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // ✅ valid value, instant scroll
      });

      // Also ensure body scroll position resets (handles Safari quirks)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]); // Fires on every route change

  return null;
}
