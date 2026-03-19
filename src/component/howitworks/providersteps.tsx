// src/component/serviceProviders/ServiceProviderCards.tsx
'use client';
import { ArrowRight, CheckCircle2, Mail, Star, UserPlus } from 'lucide-react';
import Link from 'next/link';

const ServiceProviderCards = () => {
  const steps = [
    {
      icon: <UserPlus size={28} />,
      title: "Register",
      description: "Create your profile with services, experience, and credentials.",
      color: "bg-[rgba(167,44,62,0.2)] text-[var(--color-primary)]", // lighter primary
    },
    {
      icon: <CheckCircle2 size={28} />,
      title: "Get Verified",
      description: "Complete our verification process to build trust with customers.",
      color: "bg-[rgba(184,144,84,0.2)] text-[rgba(184,144,84,1)]", // light golden mud
    },
    {
      icon: <Mail size={28} />,
      title: "Receive Bookings",
      description: "Get contacted by families for events matching your services.",
      color: "bg-[rgba(184,144,84,0.1)] text-[rgba(184,144,84,0.8)]", // lighter golden mud
    },
    {
      icon: <Star size={28} />,
      title: "Build Reputation",
      description: "Deliver great service and earn positive reviews and ratings.",
      color: "bg-[rgba(72,187,120,0.2)] text-[rgba(72,187,120,1)]", // light green
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          For Service Providers
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mt-4">
          Join our platform and connect with families looking for authentic Jain event services
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Icon Circle */}
            <div className={`w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold ${step.color}`}>
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">{step.title}</h3>

            {/* Description */}
            <p className="mt-2 text-gray-600 text-sm md:text-base">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Become a Provider Button */}
      <div className="mt-12 text-center">
        <Link href="/register">
          <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:opacity-90 transition shadow-lg font-semibold">
            Become a Provider
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>

    </section>
  );
};

export default ServiceProviderCards;
