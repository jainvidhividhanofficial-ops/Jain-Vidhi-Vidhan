// components/ServiceCard.js
import React from 'react';

// ServiceCard Component with TypeScript types
interface ServiceCardProps {
  tag: string;
  image: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  onViewMore?: () => void;
  primaryColor?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  tag, 
  image, 
  title, 
  description, 
  price, 
  duration, 
  onViewMore,
  primaryColor = '#a72c3e' 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 overflow-hidden w-full">
      {/* Image with Tag overlay - Reduced height */}
      <div className="h-50 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Tag stacked on top corner */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded-full shadow-lg">
            {tag}
          </span>
        </div>
      </div>
      
      {/* Content - Reduced padding */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Price and Duration */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold" style={{ color: primaryColor }}>
            {price}
          </div>
          <div className="text-gray-500 text-sm font-medium">{duration}</div>
        </div>
        
        {/* Button */}
        <button 
          onClick={onViewMore}
          className="w-full text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300" 
          style={{ backgroundColor: primaryColor }}
        >
          View More Details
        </button>
      </div>
    </div>
  );
};

// Services Section Component
interface ServicesSectionProps {
  primaryColor?: string;
  onViewAllPackages?: () => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  primaryColor = '#a72c3e',
  onViewAllPackages 
}) => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sabse Zyada Booked Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete event solutions with all services included - from pandits to decorations
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-w-full mx-auto mb-12">
          {/* Pooja & Vidhan Card */}
          <ServiceCard
            tag="Musical Phere"
            image="https://i.pinimg.com/1200x/81/8f/d8/818fd881de48088d87a19527e8ec5101.jpg"
            title="Musical phere"
            description="Complete Shantinath Vidhan, Panch Parmeshthi Pooja with authentic rituals performed by verified pandits"
            price="₹51,000"
            duration="2-3 hours"
            primaryColor={primaryColor}
            onViewMore={() => console.log('View Pooja & Vidhan details')}
          />

          {/* Shaadi & Family Functions Card */}
          <ServiceCard
            tag="Shaadi"
            image="https://i.pinimg.com/736x/0e/28/d4/0e28d4bbd4b48947f3bdd7b9109e8688.jpg"
            title="Shantinath Vidhan/PanchParmeshti Vidhan"
            description="Traditional Jain wedding ceremonies with Sangeet, Mehendi, and all family celebration rituals"
            price="₹21,000"
            duration="6-8 hours"
            primaryColor={primaryColor}
            onViewMore={() => console.log('View Shaadi details')}
          />

          {/* Bhajan Mandali Card */}
          <ServiceCard
            tag="Bhajan"
            image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
            title="Bhajan Sandhya"
            description="Live Bhakti music groups with Dholak, Drum, and traditional Jain bhajan performances"
            price="₹10,500"
            duration="3-4 hours"
            primaryColor={primaryColor}
            onViewMore={() => console.log('View Bhajan Mandali details')}
          />
        </div>

        {/* View All Packages Button */}
        <div className="text-center">
          <button 
            onClick={onViewAllPackages}
            className="px-8 py-4 rounded-lg font-semibold text-lg border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: 'transparent'
            }}
          >
            View All Packages →
          </button>
        </div>
      </div>
    </section>
  );
};

export { ServiceCard, ServicesSection };
export default ServicesSection;