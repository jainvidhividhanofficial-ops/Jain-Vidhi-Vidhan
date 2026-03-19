'use client';

import { Shield, Star, Users } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Users className="text-[#a72c3e]" size={36} />,
      title: 'Reach More Customers',
      description: 'Connect with families across India looking for your services.'
    },
    {
      icon: <Shield className="text-[#f59e0b]" size={36} />,
      title: 'Build Trust',
      description: 'Get verified status and customer reviews to enhance your credibility.'
    },
    {
      icon: <Star className="text-[#2563eb]" size={36} />,
      title: 'Grow Your Business',
      description: 'Increase bookings and expand your service offerings.'
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
          Why Join Our Network
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-gray-50">
                {item.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
