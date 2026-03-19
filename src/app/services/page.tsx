'use client';

import FilterBar from "@/component/filter";
import ServiceList from "@/component/service/cards";
import ServiceCategorySection from "@/component/service/servicecategory";
import { allServicesData, Service } from "@/data";
import { useCallback, useMemo, useState } from "react";

const allServices = allServicesData;

// ===============================
// FILTER OPTIONS
// ===============================
const serviceFiltersData = [
  {
    label: "Type",
    options: ["Pooja", "Vidhan", "Swadhyay", "Pravachan", "Family Functions"],
  },
  {
    label: "Sort",
    options: ["Price A-Z", "Price Low to High", "Price High to Low"],
  },
];

// ===============================
// SERVICES PAGE
// ===============================
export default function ServicesPage() {
  const allServices = useMemo(() => allServicesData, []);
  const serviceFilters = useMemo(() => serviceFiltersData, []);

  const [filteredServices, setFilteredServices] = useState<Service[]>(allServices);

  // Memoized callback to avoid infinite re-render
  const handleResultsChange = useCallback((results: Service[]) => {
    setFilteredServices(results);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section
        className="w-full text-center text-white pt-36 md:pt-40 pb-24 px-4"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Individual Services
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
          Book specific services for your Jain religious and cultural events.
          Flexible, customizable, and authentic.
        </p>
      </section>

      {/* FILTER BAR */}
      <FilterBar
        pageType="services"
        searchPlaceholder="Search services..."
        filters={serviceFilters}
        items={allServices}
        searchableKey="title"
        onResultsChange={handleResultsChange}
      />

      {/* SERVICE CARDS */}
      <ServiceList services={filteredServices} />

      {/* SERVICE CATEGORIES SECTION */}
      <ServiceCategorySection />
    </div>
  );
}
