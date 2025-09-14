import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your vehicle has been successfully booked.</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-semibold">#BK12345</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-semibold">Royal Enfield Classic 350</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date & Time</p>
              <p className="font-semibold">Mar 15, 2024 - 10:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date & Time</p>
              <p className="font-semibold">Mar 17, 2024 - 6:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold">₹2,400</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-green-600">Confirmed</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View All Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
