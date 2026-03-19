import { Search } from "lucide-react";
import React from "react";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  resultsCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
      {/* Search bar + results count */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#a72c3e] focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Results count */}
        <span className="text-gray-600 font-medium text-sm md:text-base">
          {resultsCount} articles found
        </span>
      </div>

      {/* Divider line */}
      <div className="w-full h-px bg-gray-200 mt-6 mb-8"></div>

        

      </div>
  );
};

export default SearchHeader;
