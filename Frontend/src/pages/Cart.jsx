import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getCartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } from '../utils/CartUtils';

// Backend URL for images
const API_URL = 'http://localhost:3001';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");

  useEffect(() => {
    // Load cart items when component mounts
    loadCartItems();

    // Add event listener for cart updates
    window.addEventListener('cartUpdated', loadCartItems);

    return () => {
      window.removeEventListener('cartUpdated', loadCartItems);
    };
  }, []);

  const loadCartItems = () => {
    setLoading(true);
    const items = getCartItems();
    setCartItems(items);
    
    // Calculate total
    const cartTotal = getCartTotal();
    setTotal(cartTotal);
    
    setLoading(false);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    loadCartItems();
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
    loadCartItems();
  };

  const handleCheckout = () => {
    alert("Your order has been placed! Thank you for shopping with us.");
    clearCart();
    loadCartItems();
  };

  // Helper function to format image URL
  const getImageUrl = (item) => {
    // If it's an API image with relative path
    if (item.imageUrl && item.imageUrl.startsWith('/')) {
      return `${API_URL}${item.imageUrl}`;
    }
    
    // If it's an API image with absolute path
    if (item.imageUrl) {
      return item.imageUrl;
    }
    
    // If it's a local image (from fallback)
    if (item.image) {
      return item.image;
    }
    
    // Fallback to a placeholder
    return 'https://via.placeholder.com/300';
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return 'Rs. 0';
    
    // If it already has currency format (Rs. X,XXX)
    if (typeof price === 'string' && price.includes('Rs.')) {
      return price;
    }
    
    // Format as currency with thousand separators
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  return (
    <>
      <Header />
      <section className="mt-7">
        <div className="container flex justify-center px-10 max-sm:px-3">
          <div className="flex flex-wrap gap-x-12 gap-y-10 max-lg:flex-col">
            <div className="p-12 rounded-[32px] shadow-3xl">
              <strong className="mb-5 text-xl inline-block">Cart</strong>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link 
                    to="/feed" 
                    className="px-5 py-2 bg-blue-600 text-white rounded-[22px] text-base font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-y-16 flex-wrap">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex flex-wrap gap-x-12 gap-y-2 relative">
                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        width={252}
                        height={250}
                        loading="lazy"
                        className="object-cover h-64 w-64"
                      />
                      <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                        <strong className="text-lg block">{item.title}</strong>
                        <small>
                          By {typeof item.artist === 'object' 
                            ? item.artist.name || 'Unknown Artist'
                            : item.artist || 'Unknown Artist'}
                        </small>
                        <p className="text-dark font-bold text-lg">{formatPrice(item.price)}</p>
                        
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="px-5 py-2 bg-red-600 text-white rounded-[22px] text-base font-medium whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-12 bg-gray-100 lg:mt-28 max-h-[500px] [&_strong]:mb-5 rounded-lg [&_p]:mb-1 [&_p]:text-base [&_p]:font-semibold [&_p]:text-dark [&_span]:font-normal">
                <div>
                  <strong className="text-xl block">Invoice</strong>
                  <p>
                    Total: <span>{formatPrice(total)}</span>
                  </p>
                  <p>
                    Discount: <span>Rs. 0</span>
                  </p>
                  <p>
                    Delivery Fee: <span>Rs. 0</span>
                  </p>
                  <p>
                    Estimated Total: <span>{formatPrice(total)}</span>
                  </p>
                </div>
                <div>
                  <strong className="mt-12 block text-lg">Payment Method</strong>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      className="accent-black"
                      name="payment"
                      value="cashOnDelivery"
                      checked={paymentMethod === "cashOnDelivery"}
                      onChange={() => setPaymentMethod("cashOnDelivery")}
                    />
                    <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="bankTransfer"
                      className="accent-black" 
                      name="payment" 
                      value="bankTransfer"
                      checked={paymentMethod === "bankTransfer"}
                      onChange={() => setPaymentMethod("bankTransfer")}
                    />
                    <label htmlFor="bankTransfer">Bank Transfer</label>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="px-20 py-2 text-center block mt-12 bg-black rounded-[22px] text-white text-base font-medium whitespace-nowrap w-full"
                >
                  <span>Order</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;