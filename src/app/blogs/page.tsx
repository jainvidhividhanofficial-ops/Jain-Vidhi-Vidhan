'use client';

import AllArticles from "@/component/blogs/allarticle";
import BlogHero from "@/component/blogs/banner";
import FeaturedArticle from "@/component/blogs/featuredarticle";
import NewsletterSection from "@/component/blogs/newsletter";
import PopularTopics from "@/component/blogs/populartopics";
import Searchbar from "@/component/blogs/search";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">

      {/* HERO SECTION */}
      <BlogHero
  title="Blog & Articles"
  description="Insights, guides, and stories about Jain traditions, celebrations, and cultural practices. Stay connected with your heritage."
/>

      {/* SEARCH SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Searchbar
          searchQuery={""}
          setSearchQuery={() => {}}
          resultsCount={0}
        />
      </div>

      {/* MAIN CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 space-y-16">

        {/* FEATURED ARTICLE */}
        <FeaturedArticle />

        {/* ALL ARTICLES */}
        <AllArticles />

        {/* POPULAR TOPICS */}
        <PopularTopics />

        {/* NEWSLETTER / SUBSCRIBE */}
        <NewsletterSection />

      </div>
    </main>
  );
}
