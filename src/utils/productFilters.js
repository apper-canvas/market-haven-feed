export const filterProducts = (products, filters) => {
  return products.filter(product => {
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Subcategory filter
    if (filters.subcategory && product.subcategory !== filters.subcategory) {
      return false;
    }

    // Price range
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Rating filter
    if (product.rating < filters.minRating) {
      return false;
    }

    // Stock filter
    if (filters.inStockOnly && product.stock === 0) {
      return false;
    }

    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case "featured":
    default:
      return sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0));
  }
};

export const getActiveFiltersCount = (filters) => {
  let count = 0;
  
  if (filters.searchQuery) count++;
  if (filters.category) count++;
  if (filters.subcategory) count++;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
  if (filters.brands.length > 0) count += filters.brands.length;
  if (filters.minRating > 0) count++;
  if (filters.inStockOnly) count++;
  
  return count;
};