'use client';

export default function HelpSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#a72c3e]">
          Need Help with Registration?
        </h2>
        <p className="text-gray-600 mb-8">
          Our team is ready to help you get started. Contact us if you have any questions or need assistance with your profile.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:+919876543210"
            className="px-6 py-3 border border-[#a72c3e] text-[#a72c3e] rounded-lg hover:bg-[#fbeaea] transition font-medium"
          >
            Call: +91 98765 43210
          </a>
          <a
            href="mailto:support@jainvidhividhan.com"
            className="px-6 py-3 border border-[#a72c3e] text-[#a72c3e] rounded-lg hover:bg-[#fbeaea] transition font-medium"
          >
            Email: support@jainvidhividhan.com
          </a>
        </div>
      </div>
    </div>
  );
}
