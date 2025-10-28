import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/components/molecules/ProductCard";
import { productService } from "@/services/api/productService";
import { recommendationService } from "@/services/api/recommendationService";
import { filterProducts, sortProducts } from "@/utils/productFilters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ category = null, featured = false, recommended = false, limit = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const filters = useSelector((state) => state.filters);

useEffect(() => {
    loadProducts();
  }, [category, featured, recommended]);

const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (recommended) {
        data = await recommendationService.getPersonalizedRecommendations(limit || 12);
      } else if (category) {
        data = await productService.getByCategory(category);
      } else if (featured) {
        data = await productService.getFeatured();
      } else {
        data = await productService.getAll();
      }
      
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  // Apply filters and sorting
  let filteredProducts = filterProducts(products, filters);
  filteredProducts = sortProducts(filteredProducts, filters.sortBy);
  
  // Apply limit if specified
  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }

  if (filteredProducts.length === 0) {
    return <Empty message="No products found" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.Id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;