'use client';
import { allServicesData } from '@/data';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isBooked, setIsBooked] = useState(false);

  const service = useMemo(() => {
    return allServicesData.find(s => s.id === Number(id));
  }, [id]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
      </div>
    );
  }

  const handleBookNow = () => {
    router.push(`/booking?type=service&id=${id}`);
  };

  const packageFeatures = [
    "Expert service provider with years of experience",
    "Traditional rituals performed with complete authenticity",
    "Flexible timing according to your convenience",
    "High-quality materials and preparation",
    "Personalized attention to every detail"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-24 sm:pt-28 lg:pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-red-200 rounded-full opacity-20 blur-2xl -z-10"></div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {service.category}
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Price & Duration */}
            <div className="flex flex-col gap-2">
               <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">₹{service.price.toLocaleString()}</span>
                <span className="text-gray-500 text-lg">/ session</span>
              </div>
              <p className="text-gray-600"><strong>Duration:</strong> {service.duration}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What's included:
              </h3>
              <ul className="space-y-3">
                {packageFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AnimatePresence mode="wait">
                {isBooked ? (
                  <motion.div 
                    key="confirmed"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg w-full sm:w-auto"
                  >
                     <CheckCircle2 className="w-6 h-6" />
                     <span>Booking Confirmed</span>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="book-now"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    <span>Book Now</span>
                  </motion.button>
                )}
              </AnimatePresence>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-red-700 text-red-700 hover:bg-red-50 font-semibold rounded-lg transition-colors">
                <Calendar className="w-5 h-5" />
                <span>Check Availability</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕉️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Authentic Rituals</p>
                  <p className="text-xs text-gray-500">Traditional practices</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">1000+ Happy Clients</p>
                  <p className="text-xs text-gray-500">Trusted service</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
