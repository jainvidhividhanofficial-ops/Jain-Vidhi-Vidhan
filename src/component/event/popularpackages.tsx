"use client"; // make this a client component if you need interactivity

import Link from "next/link";

const PopularPackageTypes = () => {
  const packages = [
     {
      icon: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=60", // Wedding
      title: "Wedding Ceremonies",
      description:
        "Complete wedding packages including pandit, decorations, music, and all rituals",
      linkText: "View Wedding Packages",
      linkHref: "/wedding-packages",
    },
    {
      icon: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=60", // Festival
      title: "Festival Celebrations",
      description:
        "Paryushan, Diwali, and other Jain festivals with traditional arrangements",
      linkText: "View Festival Packages",
      linkHref: "/festival-packages",
    },
    {
      icon: "https://images.unsplash.com/photo-1590080870454-7db05b0a0f42?auto=format&fit=crop&w=200&q=60", // Family
      title: "Family Functions",
      description:
        "Naming ceremonies, birthdays, and other family celebrations",
      linkText: "View Family Packages",
      linkHref: "/family-packages",
    },
  ];

  return (
    <section style={{ backgroundColor: "#f9f9f9" }} className="py-16 px-4 md:px-8 lg:px-16 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
          Popular Package Types
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Choose from our most requested event packages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-6 border-2 border-gray-100 shadow-md">
                <img src={pkg.icon} alt={pkg.title} className="w-full h-full object-cover p-2" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-center text-base mb-6 flex-grow">{pkg.description}</p>

              <Link href={pkg.linkHref}>
                <span className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
                  {pkg.linkText}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPackageTypes;
