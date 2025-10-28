import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "@/store/wishlistSlice";
import { addToCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlist.productIds]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (wishlist.productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productPromises = wishlist.productIds.map(id => 
        productService.getById(id).catch(() => null)
      );
      
      const productData = await Promise.all(productPromises);
      const validProducts = productData.filter(p => p !== null);
      
      setProducts(validProducts);
    } catch (err) {
      setError("Failed to load wishlist items");
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.info("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(addToCart({ 
      product,
      quantity: 1,
      selectedSize: product.sizes?.[0] || null,
      selectedColor: product.colors?.[0] || null,
    }));
    toast.success("Added to cart!");
  };

  const handleClearWishlist = () => {
    wishlist.productIds.forEach(id => {
      dispatch(removeFromWishlist(id));
    });
    toast.info("Wishlist cleared");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadWishlistProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty 
        message="Your wishlist is empty"
        description="Save items you love to your wishlist so you can easily find them later"
        action={
          <Link to="/search">
            <Button icon="Heart">
              Discover Products
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleClearWishlist}
          icon="Trash2"
          className="text-error hover:text-error/80"
        >
          Clear All
        </Button>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.Id} className="relative">
            <ProductCard product={product} />
            
            {/* Remove Button Overlay */}
            <button
              onClick={() => handleRemoveFromWishlist(product.Id)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              aria-label="Remove from wishlist"
            >
              <ApperIcon name="X" size={16} className="text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Ready to purchase?</h3>
            <p className="text-gray-600">Move your favorite items to cart and checkout</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                products.forEach(product => {
                  if (product.stock > 0) {
                    handleAddToCart(product);
                  }
                });
              }}
              icon="ShoppingCart"
            >
              Add All to Cart
            </Button>
            
            <Link to="/search">
              <Button icon="Plus">
                Keep Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Wishlist;