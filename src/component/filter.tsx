'use client';

import { useEffect, useMemo, useState } from "react";

interface Filter {
  label: string;
  options: string[];
}

interface FilterBarProps<T> {
  pageType: "providers" | "packages" | "services";
  searchPlaceholder: string;
  filters: Filter[];
  items: T[];
  searchableKey: keyof T;
  onResultsChange: (results: T[]) => void;
}

export default function FilterBar<T>({
  pageType,
  searchPlaceholder,
  filters,
  items,
  searchableKey,
  onResultsChange,
}: FilterBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    let results = [...items];

    // 🔹 Text Search
    if (searchTerm.trim() !== "") {
      results = results.filter((item) =>
        String(item[searchableKey])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // 🔹 Type filter (context-aware)
    const selectedType = selectedFilters["Type"];
    if (selectedType && selectedType !== "All Types") {
      if (pageType === "providers") {
        results = results.filter((item: any) => {
          // Normalize the types into an array for this specific item
          const getTypes = (val: any): string[] => {
            if (Array.isArray(val)) return val.map(t => String(t).toLowerCase().trim());
            if (typeof val === "string") return val.replace(/[\[\]"]+/g, "").split(",").map(t => t.toLowerCase().trim()).filter(Boolean);
            return [];
          };

          const itemTypes = [
            ...getTypes(item.providertype),
            ...getTypes(item.providerType)
          ];

          return itemTypes.some(t => t === selectedType.toLowerCase());
        });
      } else if (pageType === "packages" || pageType === "services") {
        results = results.filter((item: any) =>
          item.category?.toLowerCase().includes(selectedType.toLowerCase())
        );
      }
    }

    // 🔹 Location filter (for providers only)
    const selectedLocation = selectedFilters["Location"];
    if (pageType === "providers" && selectedLocation && selectedLocation !== "All Locations") {
      results = results.filter((item: any) => {
        const area = String(item.servicearea || item.serviceArea || "").toLowerCase();
        return area.includes(selectedLocation.toLowerCase());
      });
    }

    // 🔹 Rating filter (for providers only)
    const selectedRating = selectedFilters["Rating"];
    if (pageType === "providers" && selectedRating && selectedRating !== "Rating: All") {
      const ratingValue = parseInt(selectedRating.replace(/[^0-9]/g, ""));
      results = results.filter((item: any) => (item.rating || 0) >= ratingValue);
    }

    // 🔹 Duration filter (for services/packages)
    const selectedDuration = selectedFilters["Duration"];
    if ((pageType === "services" || pageType === "packages") && selectedDuration && selectedDuration !== "All Durations") {
      results = results.filter((item: any) =>
        item.duration?.toLowerCase().includes(selectedDuration.toLowerCase())
      );
    }

    // 🔹 PRICE SORTING (for services/packages)
    const selectedSort = selectedFilters["Sort"];
    if (selectedSort) {
      if (selectedSort === "Price Low to High") {
        results = results.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
      } else if (selectedSort === "Price High to Low") {
        results = results.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
      } else if (selectedSort === "Price A-Z") {
        results = results.sort((a: any, b: any) =>
          String(a.title || "").localeCompare(String(b.title || ""))
        );
      }
    }

    onResultsChange(results);
  }, [searchTerm, selectedFilters, items, searchableKey, onResultsChange, pageType]);

  const handleFilterChange = (label: string, option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [label]: option,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchTerm("");
    onResultsChange(items);
  };

  const filterElements = useMemo(
    () =>
      filters.map((filter) => (
        <div key={filter.label} className="flex flex-col">
          <label className="text-xs sm:text-sm font-semibold mb-1 text-gray-700">
            {filter.label}
          </label>
          <select
            value={selectedFilters[filter.label] || ""}
            onChange={(e) => handleFilterChange(filter.label, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black bg-white focus:ring-[#a72c3e] focus:border-[#a72c3e] outline-none"
          >
            <option value="">
              {filter.label === "Type"
                ? "All Types"
                : filter.label === "Location"
                ? "All Locations"
                : filter.label === "Duration"
                ? "All Durations"
                : "All"}
            </option>
            {filter.options.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
        </div>
      )),
    [filters, selectedFilters]
  );

  return (
    <section className="bg-white shadow-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-[#a72c3e] focus:border-[#a72c3e] outline-none text-black"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-wrap sm:flex-nowrap">
          {filterElements}
        </div>

        <button
          onClick={clearFilters}
          className="bg-[#a72c3e] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#8b2332] transition"
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}
