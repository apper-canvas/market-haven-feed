import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import { recommendationService } from "@/services/api/recommendationService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import StarRating from "@/components/molecules/StarRating";
import WishlistButton from "@/components/molecules/WishlistButton";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatPrice } from "@/utils/formatCurrency";
import { format } from "date-fns";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("helpful");
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    reviewerName: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [id]);

const loadProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productData, reviewsData, recommendedData] = await Promise.all([
        productService.getById(id),
        reviewService.getByProductId(id),
        recommendationService.getSimilarProducts(id, 8)
      ]);
      
      setProduct(productData);
      setReviews(reviewsData);
      setRecommendations(recommendedData);
      
      // Set default selections
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      
    } catch (err) {
      setError("Failed to load product details. Please try again.");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    dispatch(addToCart({ 
      product,
      quantity,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null,
    }));
    
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

const handleVoteHelpful = async (reviewId) => {
    try {
      await reviewService.voteHelpful(reviewId);
      const updatedReviews = await reviewService.getByProductId(id);
      setReviews(updatedReviews);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to record your vote");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (reviewForm.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.create({
        productId: id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        reviewerName: reviewForm.reviewerName
      });

      const updatedReviews = await reviewService.getByProductId(id);
      setReviews(updatedReviews);
      
      setShowReviewModal(false);
      setReviewForm({ rating: 0, title: "", comment: "", reviewerName: "" });
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleReviewModal = () => {
    setShowReviewModal(!showReviewModal);
    if (!showReviewModal) {
      setReviewForm({ rating: 0, title: "", comment: "", reviewerName: "" });
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortOrder) {
      case "helpful":
        return sorted.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
      case "newest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const getReviewStats = () => {
    if (reviews.length === 0) return null;
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
    }));

    return { avgRating, distribution, total: reviews.length };
  };

  const stats = getReviewStats();
  const sortedReviews = getSortedReviews();
  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return <Error message={error} onRetry={loadProductData} />;
  }

  const priceInfo = formatPrice(product.price, product.compareAtPrice);

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 space-x-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ApperIcon name="ChevronRight" size={16} />
        <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">
          {product.category}
        </Link>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImage === index ? "border-primary" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{product.brand}</Badge>
              <WishlistButton productId={product.Id} />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <StarRating 
              rating={product.rating} 
              showCount 
              reviewCount={product.reviewCount}
              size={18}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {priceInfo.price}
              </span>
              {priceInfo.compareAt && (
                <span className="text-xl text-gray-500 line-through">
                  {priceInfo.compareAt}
                </span>
              )}
              {priceInfo.savingsPercent && (
                <Badge variant="error" className="bg-primary text-white">
                  -{priceInfo.savingsPercent}% OFF
                </Badge>
              )}
            </div>
            {priceInfo.savings && (
              <p className="text-success font-medium">
                You save {priceInfo.savings}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 10 ? (
              <Badge variant="success" className="bg-success/10 text-success">
                <ApperIcon name="Check" size={14} className="mr-1" />
                In Stock
              </Badge>
            ) : product.stock > 0 ? (
              <Badge variant="warning" className="bg-warning/10 text-warning">
                <ApperIcon name="AlertTriangle" size={14} className="mr-1" />
                Only {product.stock} left
              </Badge>
            ) : (
              <Badge variant="error" className="bg-error/10 text-error">
                <ApperIcon name="X" size={14} className="mr-1" />
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  disabled={quantity >= product.stock}
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3"
              size="lg"
              icon="ShoppingCart"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            
<WishlistButton 
              productId={product.Id} 
              className="w-full py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-primary bg-white hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 text-base font-semibold"
            />
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-display font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-surface rounded-xl border border-gray-100 p-6">
          <h3 className="font-display font-semibold text-xl mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
{/* Reviews */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-2xl">Customer Reviews</h3>
        </div>

        {/* Review Statistics */}
        {stats && (
          <div className="bg-surface rounded-xl border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
                  <StarRating rating={stats.avgRating} size={20} />
                  <p className="text-sm text-gray-600 mt-2">{stats.total} {stats.total === 1 ? 'review' : 'reviews'}</p>
                </div>
              </div>

              <div className="space-y-2">
                {stats.distribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <ApperIcon name="Star" size={14} className="text-accent fill-accent" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort and Write Review */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-40"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </Select>
          </div>
          
          <Button onClick={toggleReviewModal} icon="Edit">
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-surface rounded-xl border border-gray-100 p-8 text-center">
            <ApperIcon name="MessageCircle" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
            <Button onClick={toggleReviewModal} icon="Edit">
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review.Id} className="bg-surface rounded-xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} size={16} />
                      {review.verified && (
                        <Badge variant="success" size="xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{review.title}</h4>
                    <p className="text-sm text-gray-600">
                      By {review.reviewerName} • {format(new Date(review.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoteHelpful(review.Id)}
                    icon="ThumbsUp"
                    className="text-gray-600 hover:text-primary"
                  >
                    Helpful ({review.helpfulVotes})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-2xl">Write a Review</h3>
              <button
                onClick={toggleReviewModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-error">*</span>
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  size={32}
                  interactive={true}
                  onChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-error">*</span>
                </label>
                <Input
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title <span className="text-error">*</span>
                </label>
                <Input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Summarize your review"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review <span className="text-error">*</span>
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts about this product"
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1"
                  icon="Send"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleReviewModal}
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Recommended Products */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-display font-semibold text-2xl">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;