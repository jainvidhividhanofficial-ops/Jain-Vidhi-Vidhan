'use client';
import Link from "next/link";

import { Service } from "@/data";

// ✅ Props interface
interface ServiceListProps {
  services: Service[];
}

// ✅ Default export: ServiceList component
export default function ServiceList({ services }: ServiceListProps) {
  return (
    <section className="bg-[#f9f9f9] py-12">
      <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Image + Category Tag */}
            <div className="relative h-56">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {service.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {service.title}
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-sm flex-grow mb-4 line-clamp-3">
                {service.description}
              </p>

              {/* Duration & Price */}
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-gray-700 text-sm">Duration: {service.duration}</span>
                <span className="text-[var(--color-primary)] font-bold text-lg">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>

              {/* View Details Button */}
              <Link
                href={`/services/${service.id}`}
                className="mt-auto inline-block text-center bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
