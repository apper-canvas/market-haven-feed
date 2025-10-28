import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const CartBadge = ({ children }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 animate-bounce-in"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartBadge;