// components/TrustedProvidersSection.tsx
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import React from 'react';

// Provider Card Component
interface ProviderCardProps {
  name: string;
  category: string;
  rating: number;
  experience: string;
  verified: boolean;
  profileImage: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  name,
  category,
  rating,
  experience,
  verified,
  profileImage,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group p-6 flex flex-col items-center text-center w-full sm:w-[260px] md:w-[240px] lg:w-[220px]">
      {/* Circular Profile Image */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-100">
          <img src={profileImage} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 leading-snug break-words max-w-full">
        {name}
      </h3>

      {/* Category */}
      <p className="text-gray-600 text-sm sm:text-base mb-2 break-words max-w-full">{category}</p>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-gray-800 font-semibold text-sm">{rating}</span>
      </div>

      {/* Experience */}
      <p className="text-gray-600 text-xs sm:text-sm mb-3 break-words max-w-full">{experience}</p>

      {/* Verified Badge */}
      {verified && (
        <div className="flex items-center justify-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mt-auto">
          <CheckCircle className="w-4 h-4" />
          <span>Verified</span>
        </div>
      )}
    </div>
  );
};

// Trusted Service Providers Section Component
interface TrustedProvidersSectionProps {
  onViewAllProviders?: () => void;
}

const TrustedProvidersSection: React.FC<TrustedProvidersSectionProps> = ({
  onViewAllProviders,
}) => {
  const providers = [
    {
      name: 'Pandit Rajesh Sharma',
      category: 'Pandit',
      rating: 4.9,
      experience: '22 years experience',
      verified: true,
      profileImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Swar Sangam Bhajan Mandali',
      category: 'Bhajan Mandali',
      rating: 4.8,
      experience: '15 years experience',
      verified: true,
      profileImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
    },
    {
      name: 'Anjali Jain (Anchor)',
      category: 'Anchor',
      rating: 4.7,
      experience: '8 years experience',
      verified: true,
      profileImage:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Divya Kala Artists',
      category: 'Artist',
      rating: 4.6,
      experience: '10 years experience',
      verified: true,
      profileImage:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Trusted Service Providers
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
            Verified and experienced professionals for your religious and cultural events
          </p>
        </div>

        {/* Providers Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {providers.map((provider, index) => (
            <ProviderCard
              key={index}
              name={provider.name}
              category={provider.category}
              rating={provider.rating}
              experience={provider.experience}
              verified={provider.verified}
              profileImage={provider.profileImage}
            />
          ))}
        </div>

        {/* View All Providers Button */}
<div className="text-center mt-8">
  <button
    onClick={onViewAllProviders}
    className="px-4 py-2 rounded-lg font-semibold text-sm sm:text-base bg-white border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
    style={{
      borderColor: '#a72c3e',
      color: '#a72c3e',
    }}
  >
    View All Providers
    <ArrowRight size={18} />
  </button>
</div>

      </div>
    </section>
  );
};

export default TrustedProvidersSection;
