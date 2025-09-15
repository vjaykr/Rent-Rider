import React from "react";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> January 1, 2025
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          At <strong>Rent Rider</strong> ("we," "us," "our"), we strive to provide excellent service and ensure customer satisfaction. This Refund Policy outlines the terms and conditions for refunds, cancellations, and modifications of bike rental bookings on our Platform.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1. Cancellation Policy</h2>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-medium text-green-900 mb-3">Free Cancellation Period</h3>
          <p className="text-green-800 text-sm mb-3">Cancel your booking without any charges within the specified timeframes:</p>
          <ul className="space-y-1 text-sm text-green-700">
            <li>• <strong>24+ hours before pickup:</strong> 100% refund</li>
            <li>• <strong>12-24 hours before pickup:</strong> 75% refund</li>
            <li>• <strong>6-12 hours before pickup:</strong> 50% refund</li>
            <li>• <strong>Less than 6 hours:</strong> No refund</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. Refund Process</h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm mb-3">Processing times:</p>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• <strong>Automatic refunds:</strong> 3-5 business days</li>
            <li>• <strong>Manual review cases:</strong> 7-10 business days</li>
            <li>• <strong>Disputed refunds:</strong> Up to 15 business days</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">3. Contact Information</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span className="text-gray-700">refunds@rentrider.com</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span className="text-gray-700">+91-7004904661</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}