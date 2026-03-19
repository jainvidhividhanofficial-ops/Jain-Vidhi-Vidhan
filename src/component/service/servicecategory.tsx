import Image from "next/image";

interface CategoryItem {
  title: string;
  description: string;
  image: string; // network image url
}

const categories: CategoryItem[] = [
  {
    title: "Pooja & Vidhan",
    description:
      "Traditional Jain religious ceremonies and rituals performed by experienced pandits",
    image:
      "https://i.pinimg.com/1200x/81/8f/d8/818fd881de48088d87a19527e8ec5101.jpg",
  },
  {
    title: "Bhajan Sandhya",
    description:
      "Devotional singing sessions with professional bhajan mandalis and musicians",
    image:
      "https://i.pinimg.com/1200x/58/a6/01/58a601420a95163b88aa4cafdc2f50a8.jpg",
  },
  {
    title: "Pravachan & Swadhyay",
    description:
      "Spiritual discourses and study sessions by learned Jain scholars",
    image:
      "https://i.pinimg.com/736x/58/31/bf/5831bf758993e43acf3a8eaf34d8082b.jpg",
  },
];

export default function ServiceCategorySection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Service Categories
        </h2>
        <p className="text-gray-600 mb-10">
          Explore our comprehensive range of Jain religious and cultural
          services
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl shadow-md p-6 flex flex-col items-center justify-start h-50 relative hover:shadow-lg transition-shadow"
            >
              {/* Circular avatar */}
             <div className="w-15 h-15 rounded-full overflow-hidden ring-1 ring-primary flex items-center justify-center mb-4">
  <Image
    src={cat.image}
    alt={cat.title}
    width={96}
    height={96}
    className="object-cover w-full h-full"
  />
</div>


              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {cat.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
