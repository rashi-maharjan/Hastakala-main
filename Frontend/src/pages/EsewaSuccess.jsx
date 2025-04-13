import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { 
  clearCart, 
  getCartItems, 
  removeFromCart 
} from '../utils/CartUtils';

// Backend URL
const API_URL = 'http://localhost:3001';

function EsewaSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);

  useEffect(() => {
    const verifyPaymentAndProcessOrder = async () => {
      try {
        // Parse the data parameter
        const searchParams = new URLSearchParams(location.search);
        const encodedData = searchParams.get('data');

        if (!encodedData) {
          throw new Error('No payment data received');
        }

        // Decode the base64 encoded data
        const decodedData = JSON.parse(atob(encodedData));
        
        // For test environment, we'll consider the payment successful 
        // if the transaction details are present
        if (decodedData.status === 'COMPLETE') {
          // Get current cart items
          const cartItems = getCartItems();
          setPurchasedItems(cartItems);

          // Attempt to update stock for each item in the cart
          const stockUpdatePromises = cartItems.map(async (item) => {
            try {
              await axios.patch(`${API_URL}/api/artwork/update-stock/${item._id}`);
              // Remove the item from cart after successful stock update
              removeFromCart(item._id);
            } catch (updateError) {
              console.error(`Error updating stock for item ${item._id}:`, updateError);
              // Even if stock update fails, we'll keep track of the item
            }
          });

          // Wait for all stock updates to complete
          await Promise.all(stockUpdatePromises);

          // Clear the entire cart
          clearCart();

          // Payment verified successfully
          setPaymentDetails(decodedData);
          setVerificationStatus('success');

          // Redirect to feed after a delay
          setTimeout(() => {
            navigate('/feed');
          }, 2000);
        } else {
          // Payment verification failed
          setVerificationStatus('failed');
          setErrorMessage('Payment was not completed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
        setErrorMessage(error.message || 'An unexpected error occurred');
      }
    };

    verifyPaymentAndProcessOrder();
  }, [location, navigate]);

  // Render method remains the same as in previous implementation
  const renderContent = () => {
    switch(verificationStatus) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
            <p className="text-xl">Processing Payment...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <svg 
                className="mx-auto mb-4 h-20 w-20 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Successful</h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                {paymentDetails && (
                  <>
                    <p className="text-gray-700">
                      <span className="font-semibold">Transaction Code:</span> {paymentDetails.transaction_code}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Total Amount:</span> Rs. {paymentDetails.total_amount}
                    </p>
                  </>
                )}
              </div>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully. 
                You will be redirected to the feed page shortly.
              </p>
            </div>
          </div>
        );
      
      case 'failed':
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <svg 
                className="mx-auto mb-4 h-20 w-20 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h2 className="text-3xl font-bold text-red-700 mb-4">Payment Verification Failed</h2>
              <p className="text-red-600 mb-6">{errorMessage}</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => navigate('/cart')}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Return to Cart
                </button>
                <button 
                  onClick={() => navigate('/feed')}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      {renderContent()}
    </>
  );
}

export default EsewaSuccess;