import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/store/cartSlice";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatCurrency";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "USA"
  });
  
  const [paymentData, setPaymentData] = useState({
    method: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    saveCard: false
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zip'];
    const missingFields = requiredFields.filter(field => !shippingData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate payment fields
    if (paymentData.method === "credit_card") {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
        toast.error("Please fill in all payment details");
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          price: item.product.price
        })),
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          street: shippingData.street,
          apartment: shippingData.apartment,
          city: shippingData.city,
          state: shippingData.state,
          zip: shippingData.zip,
          country: shippingData.country
        },
        paymentMethod: paymentData.method === "credit_card" 
          ? `Credit Card ending in ${paymentData.cardNumber.slice(-4)}`
          : paymentData.method === "paypal" ? "PayPal" : "Apple Pay"
      };
      
      const order = await orderService.create(orderData);
      
      // Clear cart
      dispatch(clearCart());
      
      // Show success and redirect
      toast.success("Order placed successfully!");
      navigate(`/orders`, { 
        state: { 
          newOrderId: order.orderId,
          message: "Your order has been placed successfully!" 
        } 
      });
      
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Confirmation", icon: "Check" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-4">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-200 ${
                currentStep >= step.number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {currentStep > step.number ? (
                  <ApperIcon name="Check" size={16} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className={`ml-2 font-medium transition-colors duration-200 ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`mx-4 w-8 h-0.5 transition-colors duration-200 ${
                  currentStep > step.number ? "bg-primary" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <Card className="p-6">
              <h2 className="font-display font-semibold text-xl mb-6">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    value={shippingData.firstName}
                    onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                    required
                  />
                  <Input
                    label="Last Name *"
                    value={shippingData.lastName}
                    onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  />
                </div>
                
                <Input
                  label="Street Address *"
                  value={shippingData.street}
                  onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                  required
                />
                
                <Input
                  label="Apartment, suite, etc."
                  value={shippingData.apartment}
                  onChange={(e) => setShippingData({...shippingData, apartment: e.target.value})}
                />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    required
                  />
                  <Select
                    label="State *"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                    options={[
                      { value: "CA", label: "California" },
                      { value: "NY", label: "New York" },
                      { value: "TX", label: "Texas" },
                      { value: "FL", label: "Florida" },
                      { value: "IL", label: "Illinois" },
                    ]}
                    required
                  />
                  <Input
                    label="ZIP Code *"
                    value={shippingData.zip}
                    onChange={(e) => setShippingData({...shippingData, zip: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" icon="ArrowRight">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Payment Information</h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                  icon="ArrowLeft"
                >
                  Back
                </Button>
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <div className="space-y-2">
                    {[
                      { value: "credit_card", label: "Credit Card", icon: "CreditCard" },
                      { value: "paypal", label: "PayPal", icon: "Wallet" },
                      { value: "apple_pay", label: "Apple Pay", icon: "Smartphone" },
                    ].map((method) => (
                      <label key={method.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentData.method === method.value}
                          onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                          paymentData.method === method.value ? "border-primary" : "border-gray-300"
                        }`}>
                          {paymentData.method === method.value && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <ApperIcon name={method.icon} className="mr-3 text-gray-600" size={20} />
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Credit Card Details */}
                {paymentData.method === "credit_card" && (
                  <div className="space-y-4">
                    <Input
                      label="Cardholder Name *"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      required
                    />
                    <Input
                      label="Card Number *"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date *"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        label="CVV *"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    icon="ShoppingCart"
                    loading={processing}
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && " • "}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;