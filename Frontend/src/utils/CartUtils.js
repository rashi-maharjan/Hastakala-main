// CartUtils.js - Utility functions for cart management

/**
 * Add an item to the cart
 * @param {Object} item - Item to add to cart (artwork object)
 */
export const addToCart = (item) => {
    try {
      // Get current cart items
      const cartItems = localStorage.getItem('cartItems');
      let items = [];
      
      if (cartItems) {
        items = JSON.parse(cartItems);
      }
      
      // Check if item already exists in cart
      const existingItemIndex = items.findIndex(cartItem => cartItem._id === item._id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, increase quantity
        items[existingItemIndex].quantity = (items[existingItemIndex].quantity || 1) + 1;
      } else {
        // Add new item with quantity 1
        items.push({
          ...item,
          quantity: 1
        });
      }
      
      // Save back to localStorage
      localStorage.setItem('cartItems', JSON.stringify(items));
      
      // Dispatch event for any components listening for cart updates
      window.dispatchEvent(new Event('cartUpdated'));
      
      return items;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return [];
    }
  };
  
  /**
   * Remove an item from the cart
   * @param {string} itemId - ID of the item to remove
   */
  export const removeFromCart = (itemId) => {
    try {
      // Get current cart items
      const cartItems = localStorage.getItem('cartItems');
      if (!cartItems) return [];
      
      let items = JSON.parse(cartItems);
      
      // Filter out the item with matching ID
      items = items.filter(item => item._id !== itemId);
      
      // Save back to localStorage
      localStorage.setItem('cartItems', JSON.stringify(items));
      
      // Dispatch event for any components listening for cart updates
      window.dispatchEvent(new Event('cartUpdated'));
      
      return items;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return [];
    }
  };
  
  /**
   * Update the quantity of an item in the cart
   * @param {string} itemId - ID of the item to update
   * @param {number} quantity - New quantity (must be at least 1)
   */
  export const updateCartItemQuantity = (itemId, quantity) => {
    try {
      if (quantity < 1) return;
      
      // Get current cart items
      const cartItems = localStorage.getItem('cartItems');
      if (!cartItems) return [];
      
      let items = JSON.parse(cartItems);
      
      // Find the item with matching ID
      const itemIndex = items.findIndex(item => item._id === itemId);
      
      if (itemIndex >= 0) {
        // Update quantity
        items[itemIndex].quantity = quantity;
        
        // Save back to localStorage
        localStorage.setItem('cartItems', JSON.stringify(items));
        
        // Dispatch event for any components listening for cart updates
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      return items;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return [];
    }
  };
  
  /**
   * Get all items in the cart
   * @returns {Array} Array of cart items
   */
  export const getCartItems = () => {
    try {
      const cartItems = localStorage.getItem('cartItems');
      return cartItems ? JSON.parse(cartItems) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  };
  
  /**
   * Get the total number of items in the cart
   * @returns {number} Total number of items
   */
  export const getCartItemsCount = () => {
    try {
      const items = getCartItems();
      return items.length;
    } catch (error) {
      console.error('Error getting cart items count:', error);
      return 0;
    }
  };
  
  /**
   * Calculate the total price of all items in the cart
   * @returns {number} Total price
   */
  export const getCartTotal = () => {
    try {
      const items = getCartItems();
      
      return items.reduce((total, item) => {
        // Handle price format like "Rs. 80,000"
        let price = item.price;
        if (typeof price === 'string') {
          price = price.replace('Rs.', '').replace(/,/g, '').trim();
        }
        
        const quantity = item.quantity || 1;
        return total + (parseFloat(price) * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };
  
  /**
   * Clear all items from the cart
   */
  export const clearCart = () => {
    localStorage.removeItem('cartItems');
    
    // Dispatch event for any components listening for cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  };