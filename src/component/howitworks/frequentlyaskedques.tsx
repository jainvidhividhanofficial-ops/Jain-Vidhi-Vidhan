'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "How do I know if a provider is reliable?",
    answer:
      "All providers are verified through our screening process. You can also check their ratings, reviews, and years of experience on their profile.",
  },
  {
    question: "Can I customize event packages?",
    answer:
      "Yes! Most providers offer customizable packages. Discuss your specific requirements with them to get a tailored solution for your event.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "Cancellation and rescheduling policies vary by provider. Always discuss these terms before confirming your booking.",
  },
  {
    question: "How do I pay for services?",
    answer:
      "Payment terms are arranged directly with the service provider. Most accept advance booking amounts and final payment on completion.",
  },
  {
    question: "Is there a booking fee?",
    answer:
      "No, our platform is free for customers. You only pay the service provider for their services as agreed.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We have service providers across major cities in India. Use the location filter to find providers in your area.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Common questions about using our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer transition hover:shadow-md"
            onClick={() => toggle(idx)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-medium">{faq.question}</h3>
              <span>
                {openIndex === idx ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </span>
            </div>
            {openIndex === idx && (
              <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
