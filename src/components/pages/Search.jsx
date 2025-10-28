import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSortBy } from "@/store/filtersSlice";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { getActiveFiltersCount } from "@/utils/productFilters";

const Search = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  
  const activeFiltersCount = getActiveFiltersCount(filters);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviews" },
    { value: "name", label: "Name A-Z" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {filters.searchQuery ? `Search Results for "${filters.searchQuery}"` : "All Products"}
          </h1>
          {filters.category && (
            <p className="text-gray-600 mt-1">in {filters.category}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors duration-200 ${
                viewMode === "grid" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name="Grid3X3" size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors duration-200 ${
                viewMode === "list" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name="List" size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            options={sortOptions}
            className="w-48"
          />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          onClick={() => setShowFilters(true)}
          variant="secondary"
          icon="Filter"
          className="w-full sm:w-auto"
        >
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="primary" size="xs" className="ml-2 bg-primary text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)} 
        />

        {/* Products */}
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default Search;