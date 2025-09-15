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
        <p className="text-gray-700 leading-relaxed">
          By using our Platform and making a booking, you agree to the terms outlined in this Refund Policy.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1. Cancellation Policy</h2>
        
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              1.1 Free Cancellation Period
            </h3>
            <p className="text-green-800 text-sm mb-3">Cancel your booking without any charges within the specified timeframes:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="space-y-1 text-sm text-green-700">
                <li>• <strong>24+ hours before pickup:</strong> 100% refund</li>
                <li>• <strong>12-24 hours before pickup:</strong> 75% refund</li>
              </ul>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• <strong>6-12 hours before pickup:</strong> 50% refund</li>
                <li>• <strong>Less than 6 hours:</strong> No refund</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              1.2 No-Show Policy
            </h3>
            <p className="text-yellow-800 text-sm">If you fail to show up for your booking without prior cancellation, no refund will be provided. The full booking amount will be forfeited.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. Refund Eligibility</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">✅ Eligible for Refund</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Cancellation within free cancellation period</li>
              <li>• Bike unavailable due to owner's fault</li>
              <li>• Bike doesn't match description</li>
              <li>• Safety issues with the bike</li>
              <li>• Platform technical errors</li>
              <li>• Weather-related cancellations (severe conditions)</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-3">❌ Not Eligible for Refund</h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• Late cancellations (less than 6 hours)</li>
              <li>• No-show without cancellation</li>
              <li>• Change of mind after pickup</li>
              <li>• Minor weather conditions</li>
              <li>• User's inability to operate the bike</li>
              <li>• Completed rentals</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">3. Refund Process</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">3.1 How to Request a Refund</h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p>• Log into your Rent Rider account</p>
              <p>• Navigate to "My Bookings" section</p>
              <p>• Select the booking you want to cancel</p>
              <p>• Click "Cancel Booking" and follow the prompts</p>
              <p>• For disputes, contact our support team</p>
            </div>
          </div>
          
          <div className="border-l-4 border-green-400 bg-green-50 p-4">
            <h3 className="text-lg font-medium text-green-900 mb-2">3.2 Processing Time</h3>
            <div className="text-green-800 text-sm space-y-2">
              <p>• <strong>Automatic refunds:</strong> 3-5 business days</p>
              <p>• <strong>Manual review cases:</strong> 7-10 business days</p>
              <p>• <strong>Disputed refunds:</strong> Up to 15 business days</p>
              <p>• Refunds are processed to the original payment method</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">4. Special Circumstances</h2>
        
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-900 mb-3">4.1 Weather-Related Cancellations</h3>
            <p className="text-purple-800 text-sm mb-3">Full refunds are provided for cancellations due to:</p>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Heavy rainfall (>50mm in 24 hours)</li>
              <li>• Severe weather warnings issued by authorities</li>
              <li>• Natural disasters or emergencies</li>
              <li>• Government-imposed restrictions</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-medium text-orange-900 mb-3">4.2 Bike Owner Cancellations</h3>
            <p className="text-orange-800 text-sm mb-3">If a bike owner cancels your confirmed booking:</p>
            <ul className="space-y-1 text-sm text-orange-700">
              <li>• 100% refund regardless of timing</li>
              <li>• Additional compensation may be provided</li>
              <li>• Alternative bike suggestions when available</li>
              <li>• Priority booking for future rentals</li>
            </ul>
          </div>
          
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="text-lg font-medium text-teal-900 mb-3">4.3 Platform Technical Issues</h3>
            <p className="text-teal-800 text-sm mb-3">Full refunds for bookings affected by:</p>
            <ul className="space-y-1 text-sm text-teal-700">
              <li>• Payment processing errors</li>
              <li>• App or website malfunctions</li>
              <li>• Incorrect booking confirmations</li>
              <li>• System downtime during rental period</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">5. Modification Policy</h2>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Modifications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Allowed Modifications:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Extend rental duration (subject to availability)</li>
                <li>• Change pickup/drop-off time (24+ hours notice)</li>
                <li>• Upgrade to different bike model</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Modification Fees:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Free modifications: 24+ hours before pickup</li>
                <li>• ₹50 fee: 12-24 hours before pickup</li>
                <li>• ₹100 fee: 6-12 hours before pickup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">6. Damage and Security Deposits</h2>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-900 mb-2">Security Deposit Policy</h3>
            <p className="text-red-800 text-sm mb-3">Security deposits are refundable subject to bike condition upon return:</p>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Full deposit refund: Bike returned in original condition</li>
              <li>• Partial deduction: Minor damages or cleaning required</li>
              <li>• Full forfeiture: Major damages or theft</li>
              <li>• Deposit refund processing: 3-7 business days after return</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">Damage Assessment</h3>
            <p className="text-yellow-800 text-sm">Damages are assessed based on repair costs, age of bike, and severity of damage. Detailed damage reports are provided to renters.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">7. Dispute Resolution</h2>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Disputes</h3>
          <div className="space-y-3 text-sm text-indigo-800">
            <p><strong>Step 1:</strong> Contact our customer support team with your booking details and concern</p>
            <p><strong>Step 2:</strong> Provide supporting documentation (photos, receipts, etc.)</p>
            <p><strong>Step 3:</strong> Our team will review and respond within 48 hours</p>
            <p><strong>Step 4:</strong> If unsatisfied, escalate to our dispute resolution team</p>
            <p><strong>Step 5:</strong> Final decisions are made within 15 business days</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">8. Important Notes</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Refunds are processed in the same currency as the original payment</li>
              <li>• Bank processing fees may apply and are not covered by Rent Rider</li>
              <li>• Promotional discounts may affect refund amounts</li>
              <li>• This policy may be updated periodically with notice to users</li>
              <li>• Local laws and regulations may supersede certain policy terms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">9. Contact Information</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Support</h3>
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
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Vadodara, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  <strong>Emergency Support:</strong> Available 24/7 for active rentals
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}