'use client';
import EventPackageList from "@/component/event/card";
import PopularPackageTypes from "@/component/event/popularpackages";
import WhyChoosePackages from "@/component/event/whychooseus";
import FilterBar from "@/component/filter";
import { allPackagesData } from "@/data";
import { useCallback, useMemo, useState } from "react";

export default function EventPackagesPage() {
  const serviceFilters = useMemo(() => [
    { label: "Type", options: [ "Pooja", "Vidhan", "Swadhyay", "Pravachan", "Family Functions"] },
    { label: "Sort", options: [ "Price Low to High", "Price High to Low"] },
  ], []);

  const packages = allPackagesData;

  // State for filtered packages
  const [filteredPackages, setFilteredPackages] = useState(packages);

  const handleResultsChange = useCallback((results: any) => {
    setFilteredPackages(results);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section
        className="w-full text-center text-white pt-36 md:pt-40 pb-24 px-4"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Event Packages</h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
          Complete event solutions with all services included. From intimate family gatherings to grand celebrations - we have the perfect package for you.
        </p>
      </section>

      {/* FILTER BAR */}
      <FilterBar
        pageType="packages"
        searchPlaceholder="Search packages..."
        filters={serviceFilters}
        items={packages}                // useMemo to avoid new reference each render
        searchableKey="title"
        onResultsChange={handleResultsChange} // memoized callback
      />

      {/* EVENT PACKAGE CARDS */}
      <EventPackageList packages={filteredPackages} />

      <WhyChoosePackages />
      <PopularPackageTypes />
    </div>
  );
}
