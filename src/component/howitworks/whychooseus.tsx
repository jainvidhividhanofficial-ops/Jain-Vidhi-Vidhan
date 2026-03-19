'use client';
import { CheckCircle, Clock, Star } from 'lucide-react';

const WhyChoosePlatform = () => {
  const points = [
    {
      icon: <CheckCircle size={24} />,
      title: "Verified Providers",
      description:
        "All service providers undergo thorough verification including background checks and credential validation.",
      bgColor: "bg-[var(--color-primary)]/20",
      iconColor: "text-[var(--color-primary)]",
    },
    {
      icon: <Star size={24} />,
      title: "Real Reviews",
      description:
        "Read authentic reviews from families who have used the services for their events and celebrations.",
      bgColor: "bg-yellow-200/50",
      iconColor: "text-yellow-600",
    },
    {
      icon: <Clock size={24} />,
      title: "Quick Response",
      description:
        "Get responses from providers within 24 hours. Most respond within a few hours of your inquiry.",
      bgColor: "bg-green-200/50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: Title + Points */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Why Choose Our Platform?
          </h2>
          <p className="text-gray-600 text-lg">
            We've designed our platform to make booking Jain event services as simple and reliable as possible.
          </p>

          {/* Points */}
          <div className="space-y-4 mt-4">
            {points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${point.bgColor}`}>
                  <span className={`${point.iconColor}`}>{point.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{point.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1605902711622-cfb43c443d7a?auto=format&fit=crop&w=800&q=80"
            alt="Why Choose Our Platform"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChoosePlatform;
