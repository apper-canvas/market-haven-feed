import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { Link } from "react-router-dom";

const Empty = ({ 
  message = "No items found", 
  description = "Try adjusting your filters or browse our categories",
  action = null,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <ApperIcon name="Package" size={64} className="text-gray-400" />
      </div>
      
      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 text-center">
        {message}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button icon="Home">
            Browse Products
          </Button>
        </Link>
        
        {action && action}
      </div>
    </div>
  );
};

export default Empty;