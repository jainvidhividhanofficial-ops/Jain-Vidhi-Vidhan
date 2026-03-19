// components/IndividualServices.js
import React from 'react';

// Individual Service Card Component
interface ServiceItemProps {
  image: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  onViewMore?: () => void;
  primaryColor?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ 
  image, 
  title, 
  description, 
  price, 
  duration, 
  onViewMore,
  primaryColor = '#a72c3e' 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 overflow-hidden w-full">
      {/* Content Section with Row Layout */}
      <div className="p-4 flex items-start gap-4">
        {/* Small Square Image Container */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content on the right side */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>
          
          {/* Price and Duration */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xl font-bold" style={{ color: primaryColor }}>
              {price}
            </div>
            <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {duration}
            </div>
          </div>
          
          {/* View More Button */}
          
        </div>
      </div>
    </div>
  );
};

// Individual Services Section Component
interface IndividualServicesSectionProps {
  primaryColor?: string;
  onViewAllServices?: () => void;
}

const IndividualServicesSection: React.FC<IndividualServicesSectionProps> = ({ 
  primaryColor = '#a72c3e',
  onViewAllServices 
}) => {
  const services = [
    {
      title: "Daily Jin Pooja",
      description: "Experience the serenity of a traditional Jain Jin Pooja performed by an experienced Panditji. Includes idol Abhishek, Ashtaprakari Pooja, and Aarti. Perfect for daily spiritual upliftment.",
      price: "₹1,500",
      duration: "1 hour 30 minutes",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=150&fit=crop"
    },
    {
      title: "Shanti Vidhan",
      description: "Book a comprehensive Shanti Vidhan for peace, prosperity, and removal of obstacles. Performed with full rituals and chanting by a revered Panditji. Ideal for special occasions and family well-being.",
      price: "₹7,500",
      duration: "3 hours",
      image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=300&h=150&fit=crop"
    },
    {
      title: "Jain Bhajan Sandhya",
      description: "An enchanting evening of devotional Jain Bhajans and Kirtans. Our talented Bhajan Mandali will create a spiritual atmosphere, perfect for any religious gathering or family event.",
      price: "₹12,000",
      duration: "2 hours 30 minutes",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=150&fit=crop"
    },
    {
      title: "Pravachan Session",
      description: "Engage in insightful religious discourse (Pravachan) by a learned scholar. Topics cover Jain philosophy, ethics, and spiritual living. Available for individual or group sessions.",
      price: "₹3,000",
      duration: "1 hour",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=150&fit=crop"
    },
    {
      title: "Swadhyay & Pathshala",
      description: "Personalized Swadhyay (self-study) sessions or group Pathshala for in-depth understanding of Jain scriptures. Guided by experienced teachers to deepen your spiritual knowledge.",
      price: "₹2,000",
      duration: "1 hour 15 minutes",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=150&fit=crop"
    },
    {
      title: "Jain Griha Pravesh Pooja",
      description: "Bless your new home with a traditional Jain Griha Pravesh Pooja. Ensure positive energy and prosperity with sacred rituals performed by a skilled Panditji.",
      price: "₹4,500",
      duration: "2 hours",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=150&fit=crop"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Individual Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Book specific services for your requirements - flexible and customizable
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-w-full mx-auto mb-12">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              image={service.image}
              title={service.title}
              description={service.description}
              price={service.price}
              duration={service.duration}
              primaryColor={primaryColor}
              onViewMore={() => console.log(`View ${service.title} details`)}
            />
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center">
          <button 
            onClick={onViewAllServices}
            className="px-8 py-4 rounded-lg font-semibold text-lg border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: 'transparent'
            }}
          >
            View All Services →
          </button>
        </div>
      </div>
    </section>
  );
};

export { IndividualServicesSection, ServiceItem };
export default IndividualServicesSection;