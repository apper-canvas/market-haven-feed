import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StarRating from "@/components/molecules/StarRating";
import WishlistButton from "@/components/molecules/WishlistButton";
import { formatPrice } from "@/utils/formatCurrency";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const priceInfo = formatPrice(product.price, product.compareAtPrice);

  return (
    <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]">
      <Link to={`/product/${product.Id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Wishlist button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <WishlistButton productId={product.Id} />
          </div>
          
          {/* Sale badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Badge 
              variant="error" 
              className="absolute top-3 left-3 text-white bg-primary"
            >
              -{priceInfo.savingsPercent}%
            </Badge>
          )}
          
          {/* Stock status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error" className="bg-error text-white">
                Out of Stock
              </Badge>
            </div>
          )}
          
          {product.stock > 0 && product.stock < 10 && (
            <Badge 
              variant="warning" 
              className="absolute bottom-3 left-3 bg-warning text-white"
            >
              Only {product.stock} left
            </Badge>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          {/* Brand */}
          <div className="text-sm text-gray-500 font-medium">
            {product.brand}
          </div>
          
          {/* Product name */}
          <h3 className="font-display font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Rating */}
          <StarRating 
            rating={product.rating} 
            showCount 
            reviewCount={product.reviewCount}
            size={14}
          />
          
          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {priceInfo.price}
              </span>
              {priceInfo.compareAt && (
                <span className="text-sm text-gray-500 line-through">
                  {priceInfo.compareAt}
                </span>
              )}
            </div>
            {priceInfo.savings && (
              <div className="text-sm text-success font-medium">
                Save {priceInfo.savings}
              </div>
            )}
          </div>
          
          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            icon="ShoppingCart"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;