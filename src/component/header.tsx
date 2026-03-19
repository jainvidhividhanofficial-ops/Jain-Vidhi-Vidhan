'use client';

import { useAuth } from '@/app/context/authcontext'; // ✅ import auth hook
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logoutProvider } = useAuth(); // ✅ login state
  const router = useRouter();

  const handleLogout = () => {
    logoutProvider();
    router.push('/');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-[var(--color-primary)] text-white text-xs sm:text-sm py-2 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 sm:px-8 w-full">
          {/* Left Side */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span className="whitespace-nowrap">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span className="whitespace-nowrap">contact@jainvidhividhan.com</span>
            </div>
          </div>

          {/* Right Side (Location) */}
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span className="whitespace-nowrap">Serving Across India</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md w-full">
        <div className="flex justify-between items-center h-16 px-4 sm:px-8 w-full">
          {/* Logo + Brand */}
         <Link href="/" className="flex items-center w-auto">
  <div className="relative h-12 sm:h-16 md:h-20 lg:h-24 w-[160px] sm:w-[200px] md:w-[260px] lg:w-[320px]">
    <Image
      src="/navbar.png"
      alt="Jain Vidhi Navbar Logo"
      fill
      priority
      className="object-contain object-left sm:object-center"
    />
  </div>
</Link>


          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 font-medium text-black">
            <Link href="/services" className="transition hover:text-[var(--color-primary)]">Services</Link>
            <Link href="/packages" className="transition hover:text-[var(--color-primary)]">Event Packages</Link>
            <Link href="/serviceproviders" className="transition hover:text-[var(--color-primary)]">Service Providers</Link>
            <Link href="/howitworks" className="transition hover:text-[var(--color-primary)]">How It Works</Link>

            {isLoggedIn ? (
              <>
                <Link href="/profile" className="transition hover:text-[var(--color-primary)]">
                  Profile
                </Link>
                <Link href="/refer" className="transition hover:text-[var(--color-primary)]">
                  Refer & Earn
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 border border-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
              >
                Register/Login as Provider
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white w-full">
            <div className="flex flex-col space-y-3 px-4 py-4 text-black font-medium">
              <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
              <Link href="/packages" onClick={() => setMenuOpen(false)}>Event Packages</Link>
              <Link href="/serviceproviders" onClick={() => setMenuOpen(false)}>Service Providers</Link>
              <Link href="/howitworks" onClick={() => setMenuOpen(false)}>How It Works</Link>

              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link href="/refer" onClick={() => setMenuOpen(false)}>Refer & Earn</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-center bg-gray-100 border border-gray-300 text-black py-2 rounded-full hover:bg-gray-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full text-center hover:opacity-90 transition"
                >
                  Register/Login as Provider
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[88px] sm:h-[88px] md:h-[88px] lg:h-[96px]" />
    </header>
  );
};

export default Header;
