// components/HowItWorks.js
import { ArrowRight, CheckCircle, MessageCircle, Search } from 'lucide-react';
import React from 'react';

// How It Works Step Component
interface StepProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  circleColor: string;
}

const Step: React.FC<StepProps> = ({ stepNumber, icon, title, description, circleColor }) => {
  return (
    <div className="text-center">
      {/* Icon Circle */}
      <div className="flex justify-center mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: circleColor }}
        >
          <div className="text-white text-xl">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// How It Works Section Component
interface HowItWorksSectionProps {
  primaryColor?: string;
  onLearnMore?: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ 
  primaryColor = '#a72c3e',
  onLearnMore 
}) => {
  const steps = [
    {
      stepNumber: 1,
      icon: <Search size={24} />,
      title: "1. Search & Browse",
      description: "Find services and packages in your city. Compare prices, ratings, and reviews.",
      circleColor: primaryColor
    },
    {
      stepNumber: 2,
      icon: <MessageCircle size={24} />,
      title: "2. Connect & Discuss",
      description: "Contact verified providers directly. Discuss requirements and get custom quotes.",
      circleColor: "#d97706" // Dark gold
    },
    {
      stepNumber: 3,
      icon: <CheckCircle size={24} />,
      title: "3. Book & Enjoy",
      description: "Confirm your booking and enjoy a seamless, authentic Jain event experience.",
      circleColor: "#f5e6d3" // Light beige
    }
  ];

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Simple steps to book your perfect Jain event services
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <Step
              key={index}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
              circleColor={step.circleColor}
            />
          ))}
        </div>

        {/* Learn More Button */}
        <div className="text-center">
          <button 
            onClick={onLearnMore}
            className="px-8 py-4 rounded-lg font-semibold text-lg text-white hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
            style={{ backgroundColor: primaryColor }}
          >
            Learn More
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;