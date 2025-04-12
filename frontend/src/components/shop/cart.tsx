import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, XCircle } from "lucide-react";

const Cart: React.FC = () => {
  const { items, addToCart, removeFromCart, reduceQuantity, clearCart } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="relative">
        <motion.button
          type="button"
          className="relative flex items-center justify-center p-2 rounded-md shadow-md  "
          onClick={toggleCart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          <motion.div
            className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: totalItems > 0 ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {totalItems}
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 z-50 h-full w-80 md:w-96  shadow-lg overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <motion.button
                  onClick={toggleCart}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XCircle className="w-6 h-6" />
                </motion.button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4">Your cart is empty</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white text-gray-800 p-3 rounded-lg shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.images[1]}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-blue-600 font-bold">
                              ${item.priceTag}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                              onClick={() => reduceQuantity(item._id)}
                            >
                              -
                            </motion.button>
                            <span className="w-6 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                              onClick={() => addToCart(item)}
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 border-t  pt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Total:</span>
                      <span>
                        $
                        {items
                          .reduce(
                            (sum, item) => sum + item.priceTag * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
                      >
                        Checkout
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
                        onClick={clearCart}
                      >
                        Empty Cart
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
