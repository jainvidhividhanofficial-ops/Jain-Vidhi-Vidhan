import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#a72c3e] text-white">
      {/* Top CTA */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Plan Your Event?
        </h2>
        <p className="text-lg mb-8">
          Join thousands of families who trust us for their religious and cultural celebrations
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/packages">
            <button className="bg-[#d4a017] hover:bg-[#c09414] text-black font-semibold px-6 py-3 rounded-md w-full sm:w-auto shadow-lg transition-transform hover:scale-105">
              Browse Packages
            </button>
          </Link>
          <Link href="/register">
            <button className="border-2 border-white px-6 py-3 rounded-md hover:bg-white hover:text-[#9a2c34] w-full sm:w-auto font-semibold shadow-lg transition-transform hover:scale-105">
              Become a Provider
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + Social */}
          <div className="flex flex-col gap-4">
            {/* Logo + Brand Row */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/vvi.png" // replace with your logo path
                  alt="Jain Vidhi Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-white">JAIN VIDHI</h3>
                <p className="text-sm sm:text-base font-medium text-white">VIDHAN</p>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xs text-white">
              Your trusted partner for authentic Jain religious and cultural event
              services. Connecting communities with verified service providers across India.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-yellow-300">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-yellow-300">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-yellow-300">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-yellow-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Individual Services</a></li>
              <li><a href="#" className="hover:underline">Event Packages</a></li>
              <li><a href="#" className="hover:underline">Service Providers</a></li>
              <li><a href="#" className="hover:underline">How It Works</a></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Pooja & Vidhan</li>
              <li>Bhajan Sandhya</li>
              <li>Pravachan & Swadhyay</li>
              <li>Family Functions</li>
              <li>Festival Celebrations</li>
              <li>Wedding Ceremonies</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Jain Temple Road,<br />Mumbai, Maharashtra 400001</li>
              <li>+91 98765 43210</li>
              <li>info@jainvidhividhan.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
