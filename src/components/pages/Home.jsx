import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProductGrid from "@/components/organisms/ProductGrid";
import { setCategory } from "@/store/filtersSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };
  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary text-white">
        <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Shop the latest trends and find everything you need at unbeatable prices. 
              Quality products, fast shipping, and exceptional service.
            </p>
            <Link to="/search">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                icon="Search"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <div className="grid grid-cols-3 gap-4 h-full p-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold">Shop by Category</h2>
          <Link to="/search">
            <Button variant="ghost" icon="ArrowRight">
              View All
            </Button>
          </Link>
        </div>
        
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {!categoriesLoading && categories.map((category) => (
            <Link
              key={category.Id}
              to={`/category/${category.slug}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-200 group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <ApperIcon name={category.icon} className="text-primary" size={24} />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

{/* Recommended For You Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold">Recommended For You</h2>
          <Link to="/search">
            <Button variant="ghost" icon="ArrowRight">
              View All
            </Button>
          </Link>
        </div>
        
        <ProductGrid recommended={true} limit={8} />
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold">Featured Products</h2>
          <Link to="/search">
            <Button variant="ghost" icon="ArrowRight">
              View All Products
            </Button>
          </Link>
        </div>
        
        <ProductGrid featured={true} limit={8} />
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <ApperIcon name="Truck" className="text-success" size={32} />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Free Shipping</h3>
          <p className="text-gray-600">
            Free shipping on orders over $50. Fast and reliable delivery to your door.
          </p>
        </Card>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-info/10 flex items-center justify-center">
            <ApperIcon name="Shield" className="text-info" size={32} />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Secure Payment</h3>
          <p className="text-gray-600">
            Your payment information is safe with our secure checkout process.
          </p>
        </Card>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
            <ApperIcon name="RotateCcw" className="text-warning" size={32} />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Easy Returns</h3>
          <p className="text-gray-600">
            Not satisfied? Return your items within 30 days for a full refund.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default Home;