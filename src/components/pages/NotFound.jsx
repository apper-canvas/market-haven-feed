import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/10 rounded-full p-8">
              <ApperIcon name="Search" size={64} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg" icon="Home">
              Go Home
            </Button>
          </Link>
          
          <Link to="/search">
            <Button variant="secondary" size="lg" icon="Search">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help finding something?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/" className="text-primary hover:text-primary/80 flex items-center gap-1">
              <ApperIcon name="Home" size={16} />
              Home
            </Link>
            <Link to="/search" className="text-primary hover:text-primary/80 flex items-center gap-1">
              <ApperIcon name="Search" size={16} />
              All Products
            </Link>
            <Link to="/wishlist" className="text-primary hover:text-primary/80 flex items-center gap-1">
              <ApperIcon name="Heart" size={16} />
              Wishlist
            </Link>
            <Link to="/orders" className="text-primary hover:text-primary/80 flex items-center gap-1">
              <ApperIcon name="Package" size={16} />
              Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;