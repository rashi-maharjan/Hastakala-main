import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

function OrderConfirmation() {
  const location = useLocation();
  const { state } = location;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully processed.
          </p>

          {state && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              {state.transactionCode && (
                <p className="text-gray-700">
                  <span className="font-semibold">Transaction Code:</span> {state.transactionCode}
                </p>
              )}
              {state.totalAmount && (
                <p className="text-gray-700">
                  <span className="font-semibold">Total Amount:</span> Rs. {state.totalAmount}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Link 
              to="/feed" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/events" 
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;