'use client';

export default function HeroSection() {
  return (
    <section
      className="w-full text-center text-white pt-40 md:pt-48 pb-32 px-4 bg-gradient-to-r from-[#a72c3e] to-[#8b2332]"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Join Our Network of Trusted Providers
        </h1>
        <p className="text-lg md:text-xl text-red-50 max-w-3xl mx-auto leading-relaxed">
          Connect with families looking for authentic Jain event services. Grow
          your business with our verified platform.
        </p>
      </div>
    </section>
  );
}
