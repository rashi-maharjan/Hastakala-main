import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function EsewaFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const [failureDetails, setFailureDetails] = useState(null);

  useEffect(() => {
    try {
      // Parse the data parameter
      const searchParams = new URLSearchParams(location.search);
      const encodedData = searchParams.get('data');

      if (encodedData) {
        // Decode the base64 encoded data
        const decodedData = JSON.parse(atob(encodedData));
        setFailureDetails(decodedData);
      }
    } catch (error) {
      console.error('Error parsing failure data:', error);
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
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
          <h2 className="text-3xl font-bold text-red-700 mb-4">Payment Failed</h2>
          
          {failureDetails && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Transaction UUID:</span> {failureDetails.transaction_uuid}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Product Code:</span> {failureDetails.product_code}
              </p>
              {failureDetails.status && (
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> {failureDetails.status}
                </p>
              )}
            </div>
          )}
          
          <p className="text-red-600 mb-6">
            Your payment could not be processed. Please try again or contact support.
          </p>
          
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
    </>
  );
}

export default EsewaFailure;