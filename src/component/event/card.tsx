'use client';
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventPackage {
  id: number;
  title: string;
  category: string;
  duration: string;
  description: string;
  includes: string[];
  price: number;
  image: string;
}

interface EventPackageListProps {
  packages: EventPackage[];
}

const EventPackageList: React.FC<EventPackageListProps> = ({ packages }) => {
  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {packages.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No packages match your filters.
          </p>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image + Tags */}
              <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Category Tag */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-[#a72c3e]/90 text-white rounded-md shadow-sm">
                    {pkg.category}
                  </span>
                  {/* Add more tags here if needed, stacked */}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 mb-4">
                  {pkg.title}
                </h2>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {pkg.description}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 mb-2 text-gray-700">
                  <Clock className="w-4 h-4 text-[#a72c3e]" />
                  <span className="text-sm font-medium">{pkg.duration}</span>
                </div>

                {/* Includes */}
                <div className="mb-4">
                  <span className="block text-sm font-semibold text-gray-800 mb-1">
                    Includes:
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pkg.includes.join(", ")}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-auto">
                  <div className="text-2xl font-bold text-[#a72c3e]">
                    ₹{pkg.price.toLocaleString()}
                  </div>
                  <span className="text-sm text-gray-500">Starting price</span>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/packages/${pkg.id}`}
                  className="mt-6 inline-block text-center bg-[#a72c3e] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition lg:text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default EventPackageList;
