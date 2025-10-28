import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    
    // Show success message if redirected from checkout
    if (location.state?.message) {
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordersData = await orderService.getAll();
      
      // Enrich orders with product data
      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const itemsWithProducts = await Promise.all(
            order.items.map(async (item) => {
              try {
                const product = await productService.getById(item.productId);
                return { ...item, product };
              } catch {
                return { ...item, product: null };
              }
            })
          );
          return { ...order, items: itemsWithProducts };
        })
      );
      
      setOrders(enrichedOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "CheckCircle";
      case "shipped":
        return "Truck";
      case "processing":
        return "Clock";
      case "cancelled":
        return "XCircle";
      default:
        return "Package";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadOrders} />;
  }

  if (orders.length === 0) {
    return (
      <Empty 
        message="No orders yet"
        description="You haven't placed any orders yet. Start shopping to see your orders here!"
        action={
          <Link to="/search">
            <Button icon="ShoppingCart">
              Start Shopping
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">My Orders</h1>
        <p className="text-gray-600 mt-1">
          Track and manage your orders
        </p>
      </div>

      {/* Success Message */}
      {location.state?.message && (
        <Card className="p-4 bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <ApperIcon name="CheckCircle" className="text-success" size={24} />
            <div>
              <p className="font-medium text-success">{location.state.message}</p>
              {location.state?.newOrderId && (
                <p className="text-sm text-gray-600">Order #{location.state.newOrderId}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.Id} className="overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                    <Badge 
                      variant={getStatusColor(order.status)}
                      className="capitalize"
                    >
                      <ApperIcon name={getStatusIcon(order.status)} size={14} className="mr-1" />
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {format(new Date(order.orderDate), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} items
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setExpandedOrder(expandedOrder === order.Id ? null : order.Id)}
                    icon={expandedOrder === order.Id ? "ChevronUp" : "ChevronDown"}
                  >
                    {expandedOrder === order.Id ? "Hide" : "Show"} Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {expandedOrder === order.Id && (
              <div className="p-6 space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Items Ordered</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {item.product ? (
                        <>
                          <Link to={`/product/${item.productId}`}>
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
                            />
                          </Link>
                          <div className="flex-1">
                            <Link to={`/product/${item.productId}`}>
                              <h5 className="font-medium text-gray-900 hover:text-primary transition-colors duration-200">
                                {item.product.name}
                              </h5>
                            </Link>
                            <p className="text-sm text-gray-600">{item.product.brand}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Package" className="text-gray-400" size={24} />
                          </div>
                          <div className="ml-4">
                            <p className="text-gray-600">Product no longer available</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment & Total */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {order.paymentMethod}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <div className="text-sm bg-gray-50 p-4 rounded-lg space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{order.shipping === 0 ? "FREE" : formatCurrency(order.shipping)}</span>
                      </div>
                      <hr className="my-2 border-gray-300" />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {order.status === "delivered" && (
                    <Button variant="secondary" size="sm" icon="RotateCcw">
                      Return Items
                    </Button>
                  )}
                  
                  {order.trackingNumber && (
                    <Button variant="ghost" size="sm" icon="ExternalLink">
                      Track Package
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" icon="Download">
                    Download Invoice
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;