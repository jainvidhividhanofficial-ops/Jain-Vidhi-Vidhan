
'use client';

import { allPackagesData, allServicesData } from '@/data';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle2, Loader2, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const serviceName = searchParams.get('service');
  const providerName = searchParams.get('providerName');

  const item = useMemo(() => {
    if (type === 'service') return allServicesData.find(s => s.id === Number(id));
    if (type === 'package') return allPackagesData.find(p => p.id === Number(id));
    return null;
  }, [type, id]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    date: '',
    time: '',
    address: '',
    instructions: ''
  });

  const [step, setStep] = useState<'form' | 'submitting' | 'confirmed'>('form');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Strict numeric validation for phone
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict 10-digit validation
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStep('submitting');
    
    try {
      const response = await fetch('/api/send-booking-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceName: item?.title || serviceName,
          serviceType: type || 'custom',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStep('confirmed');
      } else {
        alert('Booking failed: ' + (result.error || 'Unknown error'));
        setStep('form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please try again.');
      setStep('form');
    }
  };

  if (step === 'confirmed') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-green-500"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you, <span className="font-bold text-gray-900">{formData.name}</span>! Your booking for <span className="font-bold text-[#a72c3e]">{item?.title || serviceName}</span> {providerName ? `with ${providerName}` : ''} has been registered successfully.
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700"><strong>Booking ID:</strong> #VJ-{Math.floor(Math.random() * 10000)}</p>
          <p className="text-gray-700"><strong>Date:</strong> {formData.date}</p>
          <p className="text-gray-700"><strong>Time:</strong> {formData.time || 'TBD'}</p>
          <p className="text-gray-700"><strong>Mobile:</strong> {formData.phone}</p>
          <p className="text-gray-700"><strong>City:</strong> {formData.city || 'Not specified'}</p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-[#a72c3e] text-white font-bold rounded-xl hover:bg-[#8b2332] transition-colors shadow-lg"
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* Left side: Item Summary */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 sticky top-32"
        >
          <h2 className="text-sm uppercase tracking-widest font-bold text-[#a72c3e] mb-4">You are booking</h2>
          {item ? (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-medium">Total Price</span>
                  <span className="text-3xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="text-[#a72c3e] font-bold">{item.category}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto shadow-inner text-4xl">
                🕉️
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{serviceName}</h1>
                <p className="text-gray-600 text-sm">Professional service by <strong>{providerName}</strong></p>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-medium">Provider</span>
                  <span className="text-lg font-bold text-gray-900">{providerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Service</span>
                  <span className="text-[#a72c3e] font-bold">{serviceName}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right side: Information Form */}
      <div className="lg:col-span-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">User Information</h2>
          <p className="text-gray-600 mb-8">Please provide your details to complete the booking registration.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#a72c3e]" /> Full Name
                </label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#a72c3e]" /> City
                </label>
                <input 
                  required
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Mobile Number - Strict 10 Digits */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#a72c3e]" /> Mobile Number (Exactly 10 Digits)
              </label>
              <input 
                required
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#a72c3e]" /> Event Date
                </label>
                <input 
                  required
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all"
                />
              </div>

               {/* Time */}
               <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#a72c3e]" /> Preferred Time
                </label>
                <input 
                  required
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a72c3e]" /> Service Address
              </label>
              <textarea 
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Where should the service take place?"
                rows={3}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#a72c3e]" /> Special Instructions (Optional)
              </label>
              <textarea 
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Any special requirements or notes..."
                rows={2}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#a72c3e] focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={step === 'submitting'}
              className="w-full py-5 bg-gradient-to-r from-[#a72c3e] to-[#8b2332] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:scale-100"
            >
              {step === 'submitting' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Register Booking
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f6] to-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#a72c3e] animate-spin" />
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
