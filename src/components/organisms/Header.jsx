import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Wishlist from "@/components/pages/Wishlist";
import Home from "@/components/pages/Home";
import Cart from "@/components/pages/Cart";
import Orders from "@/components/pages/Orders";
import CartBadge from "@/components/molecules/CartBadge";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  
  const wishlistCount = useSelector((state) => state.wishlist.productIds.length);
  const cartItemsCount = useSelector((state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`);
    setShowCategoryDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-header border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-gray-900">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Store" className="text-white" size={20} />
            </div>
            Market Haven
          </Link>

          {/* Desktop Navigation */}
{/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-primary font-medium transition-colors duration-200">
                Categories
                <ApperIcon name="ChevronDown" size={16} />
              </button>
<div className="hidden group-hover:block absolute top-full left-0 mt-2 w-64 bg-surface rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                {categories.map(category => (
                  <button
                    key={category.Id}
                    onClick={() => {
                      navigate(`/category/${category.slug}`);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <ApperIcon name={category.icon} size={16} />
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <SearchBar />
            
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary transition-colors duration-200">
              <ApperIcon name="Heart" size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors duration-200">
              <CartBadge>
                <ApperIcon name="ShoppingCart" size={24} />
              </CartBadge>
            </Link>
            
<Link
              to="/orders"
              className="p-2 text-gray-700 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="Package" size={24} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-700"
          >
            <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden py-3 border-t border-gray-100">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 top-[120px] z-40 bg-black bg-opacity-50">
          <div className="bg-surface h-full overflow-y-auto">
            <nav className="p-4 space-y-4">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 font-medium"
              >
                Home
              </Link>
              
<div className="space-y-2">
                <div className="font-medium text-gray-900">Categories</div>
                {categories.map((category) => (
                  <button
                    key={category.Id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="block w-full text-left py-2 pl-4 text-gray-600 flex items-center gap-2"
                  >
                    <ApperIcon name={category.icon} size={16} />
                    {category.name}
                  </button>
                ))}
              </div>
              
              <Link
                to="/wishlist"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 font-medium flex items-center gap-2"
              >
                <ApperIcon name="Heart" size={20} />
                Wishlist ({wishlistCount})
              </Link>
              
              <Link
                to="/cart"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 font-medium flex items-center gap-2"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                Cart ({cartItemsCount})
              </Link>
              
              <Link
                to="/orders"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 font-medium flex items-center gap-2"
              >
                <ApperIcon name="Package" size={20} />
                Orders
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;