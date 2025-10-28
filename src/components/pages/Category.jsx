import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import { getActiveFiltersCount } from "@/utils/productFilters";
import { setCategory, setSortBy } from "@/store/filtersSlice";

const Category = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  
  const activeFiltersCount = getActiveFiltersCount(filters);
  
  // Find category info
const categoryInfo = categoryService.categories.find(cat => 
    cat.name.toLowerCase().replace(/\s+/g, "-") === categoryName
  );

  useEffect(() => {
    if (categoryInfo) {
      dispatch(setCategory(categoryInfo.name));
    }
  }, [categoryName, categoryInfo, dispatch]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviews" },
    { value: "name", label: "Name A-Z" },
    { value: "newest", label: "Newest" },
  ];

  if (!categoryInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h1>
        <p className="text-gray-600">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ApperIcon name={categoryInfo.icon} className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{categoryInfo.name}</h1>
            <p className="text-gray-600">Discover our collection of {categoryInfo.name.toLowerCase()}</p>
          </div>
        </div>

        {/* Subcategories */}
        {categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categoryInfo.subcategories.map((subcategory) => (
              <Badge 
                key={subcategory}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary hover:text-white transition-colors duration-200"
              >
                {subcategory}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              onClick={() => setShowFilters(true)}
              variant="secondary"
              icon="Filter"
            >
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="xs" className="ml-2 bg-primary text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)} 
        />

        {/* Products */}
        <div className="lg:col-span-3">
          <ProductGrid category={categoryInfo.name} />
        </div>
      </div>
    </div>
  );
};

export default Category;