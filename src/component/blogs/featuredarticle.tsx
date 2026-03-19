import Image from "next/image";
import Link from "next/link";

const FeaturedArticle = () => {
  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Tag */}
        <span className="inline-block bg-[#a72c3e] text-white px-4 py-1.5 rounded-md text-sm font-medium mb-4 sm:mb-6">
          Featured Article
        </span>

        {/* Latest Insights Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Latest Insights</h2>

        {/* Article Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
          <div className="grid md:grid-cols-2">
            {/* Left: Image */}
            <div className="relative h-64 sm:h-80 md:h-full md:min-h-[400px] order-1">
              <Image
                src="https://i.pinimg.com/736x/ed/4b/7d/ed4b7ddafccedec84efc2923b0826ce1.jpg"
                alt="The Soulful Power of Bhajan Mandalis"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right: Content */}
            <div className="p-6 md:p-10 flex flex-col order-2">
              {/* Author & Date */}
              <p className="text-gray-400 text-sm mb-2">
                By Sangeeta Jain • 4/1/2024
              </p>

              {/* Title */}
              <h3 className="text-black text-xl md:text-2xl font-bold mb-4">
                The Soulful Power of Bhajan Mandalis in Jain Bhakti
              </h3>

              {/* Description */}
              <p className="text-gray-700 text-base mb-6 flex-1">
                Devotional music, or bhajans, plays a crucial role in Jain religious
                gatherings, elevating the spiritual atmosphere and fostering a sense
                of community. A talented bhajan mandali can transform any event...
              </p>

              {/* Button */}
              <Link href="/blogs/bhajan-mandalis" className="mt-auto w-full sm:w-auto">
                <button className="bg-[#a72c3e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#962738] transition">
                  Read Full Article
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
