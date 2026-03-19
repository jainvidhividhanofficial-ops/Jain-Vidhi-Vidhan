import Image from "next/image";

const articles = [
  {
    title: "Why Online Booking for Jain Pujas is the Future",
    author: "Admin Team",
    date: "3/15/2024",
    img: "/blog-online-puja.jpg",
    desc: "In today's fast-paced world, convenience is key. Our platform brings the sacred tradition of Jain pujas and vidhans to you..."
  },
  {
    title: "Planning Your Perfect Jain Family Function: Traditions & Services",
    author: "Event Planner",
    date: "2/28/2024",
    img: "/blog-family-function.jpg",
    desc: "Organizing a Jain family function involves blending traditional rituals with modern comforts..."
  },
  {
    title: "A Guide to Popular Jain Vidhans and Their Significance",
    author: "Acharya Devendra",
    date: "11/20/2023",
    img: "/blog-vidhans.jpg",
    desc: "Jainism is rich with various vidhans, each holding profound spiritual meaning..."
  },
];

export default function AllArticles() {
  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#a72c3e] mb-12">
          All Articles
        </h2>

        {/* Articles Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((blog, i) => (
            <div key={i} className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              
              {/* Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority={true}
                />
              </div>

              {/* Content */}
              <div className="px-6 py-5 flex flex-col flex-1">
                {/* Author & Date */}
                <p className="text-gray-400 text-sm mb-1">
                  {blog.author} • {blog.date}
                </p>

                {/* Title */}
                <h3 className="text-black font-semibold text-lg mb-2">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 flex-1">
                  {blog.desc}
                </p>

                {/* Read More */}
                <button className="text-[#a72c3e] font-semibold text-sm hover:text-[#d4a017] mt-auto text-left">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
