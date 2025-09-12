import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> January 1, 2025
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Welcome to <strong>Rent Rider</strong> ("we," "us," "our"). By accessing or using our website, mobile application, and services (collectively, the "Platform" or "Services"), you agree to comply with and be bound by these Terms and Conditions ("Terms") and our Privacy Policy.
        </p>
        <p className="text-gray-700 leading-relaxed">
          These Terms govern your use of our Platform, whether you are a renter, bike owner, or admin.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1. Definitions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>User:</strong> Individual who uses the Platform to browse, search, book, or rent bikes.</li>
              <li><strong>Renter:</strong> Individual who rents a bike from the Platform.</li>
              <li><strong>Bike Owner:</strong> Individual or entity that lists their bike for rental.</li>
              <li><strong>Admin:</strong> Individuals managing platform operations and disputes.</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>Booking:</strong> Process of renting a bike, including requests and payments.</li>
              <li><strong>Transaction:</strong> Financial exchange between renters and bike owners.</li>
              <li><strong>Platform:</strong> Rent Rider website, mobile app, and related services.</li>
              <li><strong>Service Providers:</strong> Third-party companies assisting our services.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. User Registration and Account Security</h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-3">2.1 Registration Process</h3>
            <p className="text-blue-800 text-sm">You must provide accurate, complete, and up-to-date information during registration and maintain its accuracy.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-900 mb-3">2.2 Document Verification for Bike Owners</h3>
            <p className="text-green-800 text-sm mb-3">Required documents for bike listing verification:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Government-issued ID (Aadhar, Passport, etc.)</li>
                <li>• Bike Registration Certificate (RC)</li>
                <li>• Valid Insurance Document</li>
              </ul>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Pollution Under Control (PUC) Certificate</li>
                <li>• Valid Driving License</li>
                <li>• Fitness Certificate (if applicable)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-medium text-orange-900 mb-3">2.3 Age Requirement</h3>
            <p className="text-orange-800 text-sm">You must be at least 18 years old to use the Platform.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">3. User Responsibilities</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">General Users</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Provide accurate information</li>
              <li>• Maintain account security</li>
              <li>• Use platform lawfully</li>
              <li>• No impersonation or false info</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">Renters</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Pay all applicable fees</li>
              <li>• Follow owner's terms</li>
              <li>• Use bikes safely and legally</li>
              <li>• Return in same condition</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3">Bike Owners</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Provide accurate bike info</li>
              <li>• Ensure bike safety</li>
              <li>• Respond promptly to requests</li>
              <li>• Maintain proper insurance</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">4. Booking Process</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">4.1 Rental Requests</h3>
            <p className="text-blue-800 text-sm">Browse available bikes by location, type, price, and availability. Submit rental requests with agreed terms.</p>
          </div>
          
          <div className="border-l-4 border-green-400 bg-green-50 p-4">
            <h3 className="text-lg font-medium text-green-900 mb-2">4.2 Booking Confirmation</h3>
            <p className="text-green-800 text-sm">Bike owners approve/reject requests. Approved bookings receive confirmation with rental details.</p>
          </div>
          
          <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
            <h3 className="text-lg font-medium text-purple-900 mb-2">4.3 Payments</h3>
            <p className="text-purple-800 text-sm">Secure payments processed through Stripe or Razorpay. Fees charged at booking time.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">5. Fees and Payments</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Platform Fees</h4>
            <p className="text-sm text-blue-800">Service fee charged on each booking</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-green-900 mb-2">Payment Methods</h4>
            <p className="text-sm text-green-800">Credit/debit cards, digital wallets</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="font-semibold text-orange-900 mb-2">Taxes</h4>
            <p className="text-sm text-orange-800">Renters responsible for applicable taxes</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">6. Insurance and Liability</h2>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-900 mb-2">Important Notice</h3>
            <p className="text-red-800 text-sm">Rent Rider is not liable for injuries, damages, losses, or theft during rentals. Users agree to indemnify and hold Rent Rider harmless from any claims.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Insurance Coverage</h4>
              <p className="text-yellow-800 text-sm">Bike owners must maintain appropriate insurance. Rent Rider provides no coverage.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Renter Responsibility</h4>
              <p className="text-orange-800 text-sm">Return bike in same condition. Cover repair costs for damages.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">7. Platform Availability</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 text-sm mb-3">
            We aim to provide reliable service but don't guarantee uninterrupted access. Platform may be temporarily unavailable for maintenance.
          </p>
          <p className="text-gray-600 text-sm">
            We reserve the right to modify, suspend, or discontinue any part of the Platform at any time.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">8. Dispute Resolution</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-indigo-800 text-sm mb-3">
            <strong>Mediation:</strong> We provide assistance in resolving disputes between users but don't guarantee outcomes.
          </p>
          <p className="text-indigo-700 text-sm">
            <strong>Governing Law:</strong> These Terms are governed by the laws of India.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">9. Contact Us</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="text-gray-700">support@rentrider.com</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}