// components/Testimonials.js
import { Star } from 'lucide-react';
import React from 'react';

// Testimonial Card Component
interface TestimonialCardProps {
  rating: number;
  testimonial: string;
  customerName: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  rating, 
  testimonial, 
  customerName, 
  location 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-55 flex flex-col justify-between ">
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            className={`w-5 h-5 ${
              index < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
      
      {/* Testimonial Text */}
      <div className="flex-1">
        <p className="text-gray-700 italic text-sm leading-relaxed mb-4">
          "{testimonial}"
        </p>
      </div>
      
      {/* Customer Details */}
      <div className="mt-auto">
        <p className="font-bold text-gray-800 text-sm">{customerName}</p>
        <p className="text-gray-600 text-xs">{location}</p>
      </div>
    </div>
  );
};

// Customer Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      rating: 5,
      testimonial: "Our family's Paryushan Parv pooja was made truly special by Panditji from this platform. Everything was so well-organized, and the pandit was very knowledgeable. Bahut shanti mili!",
      customerName: "Priya Sharma",
      location: "Mumbai"
    },
    {
      rating: 5,
      testimonial: "Booked a bhajan mandali for my mother's birthday. They were fantastic! The energy was amazing, and everyone enjoyed the devotional songs. Highly recommend their services.",
      customerName: "Rajesh Gupta",
      location: "Delhi"
    },
    {
      rating: 5,
      testimonial: "For our housewarming, we needed a specific Vidhan. The platform helped us find a perfect pandit who understood all our requirements. It was a seamless experience, thank you!",
      customerName: "Anjali Mehta",
      location: "Ahmedabad"
    }
  ];

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real experiences from families who trusted us with their special occasions
          </p>
        </div>

        {/* Testimonials Row */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              rating={testimonial.rating}
              testimonial={testimonial.testimonial}
              customerName={testimonial.customerName}
              location={testimonial.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;