// components/BlogSection.js
import { ArrowRight } from 'lucide-react';
import React from 'react';

// Blog Card Component
interface BlogCardProps {
  author: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  onReadMore?: () => void;
  primaryColor?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  author, 
  date, 
  title, 
  excerpt, 
  image, 
  onReadMore,
  primaryColor = '#a72c3e' 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 overflow-hidden w-full h-110">
      {/* Image Section - Reduced height */}
      <div className="overflow-hidden relative">
  <img 
    src={image} 
    alt={title} 
    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
  />
</div>

      
      {/* Content */}
      <div className="p-8">
        {/* Author and Date */}
        <p className="text-gray-500 text-sm mb-3">By {author} • {date}</p>
        
        {/* Title */}
        <h3 className="text font-bold text-gray-800 mb-4">{title}</h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          {excerpt}
        </p>
        
        {/* Read More Button */}
        <button 
  onClick={onReadMore}
  className="bg-white border-2 font-medium text-xs py-1 px-3 rounded-md hover:shadow-md transition-all duration-300"
  style={{ 
    borderColor: primaryColor,
    color: primaryColor 
  }}
>
  Read More
</button>

      </div>
    </div>
  );
};

// Blog Section Component
interface BlogSectionProps {
  primaryColor?: string;
  onViewAllArticles?: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ 
  primaryColor = '#a72c3e',
  onViewAllArticles 
}) => {
  const blogPosts = [
    {
      author: "Admin Team",
      date: "3/15/2024",
      title: "Why Online Booking for Jain Pujas is the Future",
      excerpt: "In today's fast-paced world, convenience is key. Our platform brings the sacred tradition of Jain pujas and vidhans to your fingertips. Discover how e...",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    {
      author: "Acharya Devendra",
      date: "11/20/2023",
      title: "A Guide to Popular Jain Vidhans and Their Significance",
      excerpt: "Jainism is rich with various vidhans, each holding profound spiritual meaning and purpose. From the auspicious Ratnatraya Vidhan to the powerful Bhakt...",
      image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=400&h=300&fit=crop"
    },
    {
      author: "Sangeeta Jain",
      date: "4/1/2024",
      title: "The Soulful Power of Bhajan Mandalis in Jain Bhakti",
      excerpt: "Devotional music, or bhajans, plays a crucial role in Jain religious gatherings, elevating the spiritual atmosphere and fostering a sense of community...",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights, guides, and stories about Jain traditions and celebrations
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-w-full mx-auto mb-12">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={index}
              author={post.author}
              date={post.date}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              primaryColor={primaryColor}
              onReadMore={() => console.log(`Read more: ${post.title}`)}
            />
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center">
          <button 
            onClick={onViewAllArticles}
            className="px-8 py-2 rounded-lg font-semibold text-sm bg-white border-1 hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
            style={{ 
              borderColor: primaryColor,
              color: primaryColor
            }}
          >
            View All Articles
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;