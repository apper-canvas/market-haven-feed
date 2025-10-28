import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeCartItem, clearCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatCurrency";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeCartItem({ productId }));
      toast.info("Item removed from cart");
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId, selectedSize, selectedColor) => {
    dispatch(removeCartItem({ productId, selectedSize, selectedColor }));
    toast.info("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info("Cart cleared");
  };

  if (cartItems.length === 0) {
    return (
      <Empty 
        message="Your cart is empty"
        description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
        action={
          <Link to="/search">
            <Button icon="ShoppingCart">
              Continue Shopping
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
        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="ghost"
          onClick={handleClearCart}
          icon="Trash2"
          className="text-error hover:text-error/80"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="p-6">
              <div className="flex gap-4">
                {/* Product Image */}
                <Link to={`/product/${item.productId}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="font-semibold text-lg text-gray-900 hover:text-primary transition-colors duration-200">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600">{item.product.brand}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {item.selectedSize && (
                      <span className="text-gray-600">
                        Size: <span className="font-medium">{item.selectedSize}</span>
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="text-gray-600">
                        Color: <span className="font-medium">{item.selectedColor}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                      >
                        <ApperIcon name="Minus" size={14} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <ApperIcon name="Plus" size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(item.product.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.product.price)} each</p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId, item.selectedSize, item.selectedColor)}
                  className="p-2 text-gray-400 hover:text-error transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Stock Warning */}
              {item.product.stock < item.quantity && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="AlertTriangle" className="text-warning" size={16} />
                    <p className="text-sm text-warning">
                      Only {item.product.stock} items available in stock
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <h2 className="font-display font-semibold text-xl mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-gray-600">
                  <ApperIcon name="Info" size={14} className="inline mr-1" />
                  Free shipping on orders over $50
                </div>
              )}
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button className="w-full mt-6" size="lg" icon="CreditCard">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link to="/search">
              <Button variant="ghost" className="w-full mt-2">
                Continue Shopping
              </Button>
            </Link>
          </Card>
          
          {/* Shipping Info */}
          <Card className="p-4 bg-info/5 border border-info/20">
            <div className="flex gap-3">
              <ApperIcon name="Truck" className="text-info flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm">
                <p className="font-medium text-info">Free Shipping</p>
                <p className="text-gray-600">On orders over $50. Standard delivery 3-5 business days.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;