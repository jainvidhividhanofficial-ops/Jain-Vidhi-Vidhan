// pages/how-it-works.js
'use client';

import FAQ from "@/component/howitworks/frequentlyaskedques";
import ServiceProviderSteps from "@/component/howitworks/providersteps";
import Steps from "@/component/howitworks/steps"; // ✅ import component
import WhyChoosePlatform from "@/component/howitworks/whychooseus";

const HowItWorks = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="w-full text-center text-white pt-36 md:pt-40 pb-24 px-4"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          How It Works
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
          Simple steps to book authentic Jain event services. From search to
          celebration - we make it easy.
        </p>
      </section>

      {/* Steps Component */}
      <Steps />   
      <ServiceProviderSteps />
      <WhyChoosePlatform />
      <FAQ />
    </div>
  );
};

export default HowItWorks;
