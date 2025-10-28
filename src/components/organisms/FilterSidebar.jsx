import { useDispatch, useSelector } from "react-redux";
import {
  setPriceRange,
  toggleBrand,
  setMinRating,
  setInStockOnly,
  clearFilters,
  setCategory,
} from "@/store/filtersSlice";
import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import PriceRange from "@/components/molecules/PriceRange";
import StarRating from "@/components/molecules/StarRating";
import { productService } from "@/services/api/productService";
import { categories } from "@/services/mockData/categories.json";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const products = await productService.getAll();
      const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">Filters</h3>
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          className="text-sm"
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.Id}
              onClick={() => dispatch(setCategory(
                filters.category === category.name ? "" : category.name
              ))}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                filters.category === category.name
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={category.icon} size={16} />
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <PriceRange
          value={filters.priceRange}
          onChange={(value) => dispatch(setPriceRange(value))}
        />
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => dispatch(toggleBrand(brand))}
            />
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => dispatch(setMinRating(
                filters.minRating === rating ? 0 : rating
              ))}
              className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                filters.minRating === rating
                  ? "bg-primary/10"
                  : "hover:bg-gray-50"
              }`}
            >
              <StarRating rating={rating} size={14} />
              <span className="text-sm text-gray-600">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <Checkbox
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={(e) => dispatch(setInStockOnly(e.target.checked))}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface rounded-xl border border-gray-100 p-6 h-fit sticky top-24">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-surface p-6 overflow-y-auto transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Filters</h3>
              <Button
                variant="ghost"
                onClick={onClose}
                icon="X"
              />
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;