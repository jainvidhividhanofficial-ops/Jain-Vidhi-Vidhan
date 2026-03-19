import Footer from "@/component/footer";
import Header from "@/component/header";
import ScrollToTop from "@/component/scrolltotop";
import type { Metadata } from "next";
import { AuthProvider } from "./context/authcontext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jain Vidhi Vidhan",
  description: "Traditional Services & Event Packages across India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900">
        <AuthProvider>
          {/* Scroll Fix */}
          <ScrollToTop />

          {/* Header */}
          <Header />

          {/* Main page content */}
          <main>{children}</main>

          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
