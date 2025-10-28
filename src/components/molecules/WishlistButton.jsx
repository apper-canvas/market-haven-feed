import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const WishlistButton = ({ productId, className = "" }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.productIds.includes(productId);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(productId));
      toast.success("Added to wishlist");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full transition-all duration-200 hover:bg-primary/10",
        isInWishlist ? "text-primary" : "text-gray-400 hover:text-primary",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <ApperIcon 
        name="Heart" 
        size={20} 
        className={cn(
          "transition-transform duration-200",
          isInWishlist && "fill-current animate-pulse-heart"
        )}
      />
    </button>
  );
};

export default WishlistButton;