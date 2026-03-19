'use client';

import ServiceCard from '@/component/Servicecard';
import BlogSection from '@/component/blog';
import HowItWorksSection from '@/component/howitworks';
import IndividualServicesSection from '@/component/indivisualservices';
import TestimonialsSection from '@/component/testimonial';
import TrustedProvidersSection from '@/component/trustedserviceproviders';
import { Calendar, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Homepage = () => {
const [eventDate, setEventDate] = useState('');


// --- helper functions below useState ---
const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, ""); // keep only digits

  // auto format as DD / MM / YYYY
  if (value.length >= 3 && value.length <= 4)
    value = value.replace(/(\d{2})(\d+)/, "$1 / $2");
  else if (value.length >= 5)
    value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1 / $2 / $3");

  if (value.length > 14) value = value.slice(0, 14);
  setEventDate(value);
};

const isValidDate = (dateString: string): boolean => {
  const parts = dateString.replace(/\s/g, "").split("/");
  if (parts.length < 3) return false;
  const [day, month, year] = parts.map((p) => parseInt(p, 10));
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

  const enteredDate = new Date(year, month - 1, day);
  const today = new Date();
  return (
    enteredDate.getDate() === day &&
    enteredDate.getMonth() === month - 1 &&
    enteredDate.getFullYear() === year &&
    enteredDate >= today
  );
};

const handleConfirmDate = () => {
  if (!isValidDate(eventDate)) {
    alert("Please enter a valid future date in DD / MM / YYYY format.");
    return;
  }
  console.log("Selected Event Date:", eventDate);
  // You can now trigger your fetch, filter, or navigation logic here
};

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-20 md:pt-0"
        style={{ backgroundColor: '#a72c3e' }}
      >
        {/* Background Pattern */}
       <div className="absolute inset-0 opacity-10">
  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
  <div className="absolute top-20 left-10 w-24 h-24 border border-white/20 rounded-full"></div>
  <div className="absolute bottom-32 right-16 w-20 h-20 border border-white/20 rounded-full"></div>
</div>

<div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
  {/* Rotating Logo */}
<div className="flex justify-center mt-16 mb-2"> 
  <div
    className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-30 flex items-center justify-center animate-spin"
    style={{ animationDuration: "10s" }}
  >
    <Image
      src="/vvi.png"
      alt="JV Logo"
      width={120}
      height={96}
      className="object-contain"
    />
  </div>
</div>


  {/* Main Heading */}
  <div className="mb-6">
    <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-light mb-1">
      Find Your Perfect
    </h2>
    <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
      JAIN EVENT
    </h1>
  </div>

          {/* Subtitle */}
          <h3 className="text-white/90 text-base sm:text-lg md:text-xl font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with verified pandits, bhajan mandalis, and artists for
            authentic Jain religious ceremonies and cultural events
          </h3>

         <div className="mb-8 max-w-sm sm:max-w-md mx-auto px-2">
  <div className="flex items-center shadow-md border border-gray-200 rounded-xl bg-white/70 backdrop-blur-md px-4 py-4 sm:py-5 transition-all duration-300 w-full max-w-md mx-auto">
  <Calendar className="w-6 h-6 text-[#a72c3e] mr-3" />
  <input
    type="text"
    placeholder="DD / MM / YYYY"
    value={eventDate}
    onChange={handleDateInput}
    maxLength={14}
    className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-lg sm:text-xl font-medium placeholder:text-gray-400 tracking-wide"
  />
  <button
    onClick={handleConfirmDate}
    className="ml-3 sm:ml-4 bg-[#a72c3e] hover:bg-[#8b2332] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
  >
    Confirm
  </button>
</div>

</div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
  <Link href="/packages">
            <button className="bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Browse Event Packages
              
              <ChevronRight className="w-5 h-5" />
            </button>
              </Link>
  <Link href="/services">

            <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center gap-2">
              Individual Services
              <ChevronRight className="w-5 h-5" />
            </button>
              </Link>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-1">
                500+
              </div>
              <div className="text-gray-600 text-sm sm:text-base font-medium">
                Verified Providers
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-1">
                1000+
              </div>
              <div className="text-gray-600 text-sm sm:text-base font-medium">
                Events Completed
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-1">
                50+
              </div>
              <div className="text-gray-600 text-sm sm:text-base font-medium">
                Cities Covered
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                  4.8
                </span>
                <Star className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-yellow-400 fill-current ml-1" />
              </div>
              <div className="text-gray-600 text-sm sm:text-base font-medium">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <ServiceCard />
      <IndividualServicesSection />
      <HowItWorksSection />
      <TrustedProvidersSection />
      <TestimonialsSection />
      <BlogSection />
    </div>
  );
};

export default Homepage;
