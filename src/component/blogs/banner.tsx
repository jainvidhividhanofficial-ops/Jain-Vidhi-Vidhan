import React from 'react';

interface HeroBannerProps {
  title: string;
  description: string;
}

const BlogHeroBanner: React.FC<HeroBannerProps> = ({ title, description }) => {
  return (
    <section 
      className="relative min-h-[400px] flex items-center"
      style={{ backgroundColor: '#a72c3e' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">{description}</p>
      </div>
    </section>
  );
};

export default BlogHeroBanner;