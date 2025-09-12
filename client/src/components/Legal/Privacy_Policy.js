import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> January 1, 2025
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          At <strong>Rent Rider</strong> ("we," "our," "us"), we are dedicated to safeguarding your privacy and ensuring a secure and seamless experience when using our platform. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you access or use our website (the "Site") and related services (collectively, the "Services").
        </p>
        <p className="text-gray-700 leading-relaxed">
          By accessing or using the <strong>Rent Rider</strong> platform, you consent to the practices described in this Privacy Policy. If you do not agree with the terms set forth in this document, please refrain from using our platform.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">To provide our services effectively, we collect the following categories of personal information:</p>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">1.1 Personal Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><strong>User Profile Information:</strong> Name, email address, phone number, physical address, and date of birth.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><strong>Payment Information:</strong> Credit/debit card details, payment account information (processed via secure third-party payment gateways like Stripe or Razorpay), and transaction history.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><strong>Bike Owner Details:</strong> Information including bike listings (make, model, price, location, description, etc.), identity verification documents, and maintenance records.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><strong>Booking Details:</strong> Information related to your bike bookings, including rental duration, preferences, rental history, and payment records.</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">1.2 Usage Data</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Device information (e.g., device type, operating system, IP address, browser type).</li>
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Interaction data (e.g., pages viewed, time spent on specific pages, search queries, and other activities on our platform).</li>
              <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Log files and cookies used for site analytics and enhancing user experience.</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">1.3 Location Data</h3>
            <p className="text-gray-700">With your consent, we collect location data to offer services such as bike availability based on geographic location and real-time bike tracking.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">1.4 Communication Data</h3>
            <p className="text-gray-700">Communications with our customer support team, including chats, emails, or phone interactions, are stored to assist in resolving inquiries and improving our Services.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. How We Use Your Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Service Operations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Provision of Services:</strong> Account management, bike rentals, payments, and bookings.</li>
              <li><strong>Transaction Management:</strong> Secure payment processing, refunds, and transactional communications.</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Support & Security</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>User Support:</strong> Customer inquiries, support requests, and issue resolution.</li>
              <li><strong>Security:</strong> Platform monitoring, fraud protection, and data safety.</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Enhancement</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Improvement of Services:</strong> Platform functionality and user experience enhancement.</li>
              <li><strong>Marketing:</strong> Promotional messages and platform updates (with consent).</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2">Compliance</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Legal Obligations:</strong> User verification, identity checks, dispute resolution, and fraud prevention.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">3. Sharing of Information</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">3.1 Service Providers</h3>
            <p className="text-blue-800 text-sm">We work with trusted third-party service providers including payment processors (Stripe, Razorpay), hosting providers, and email services. All providers handle your data securely.</p>
          </div>
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">3.2 Legal Compliance</h3>
            <p className="text-yellow-800 text-sm">We may disclose information in response to lawful government requests, national security requirements, fraud prevention, and legal protection.</p>
          </div>
          <div className="border-l-4 border-purple-400 bg-purple-50 p-4">
            <h3 className="text-lg font-medium text-purple-900 mb-2">3.3 Business Transfers</h3>
            <p className="text-purple-800 text-sm">In case of merger, acquisition, or asset sale, your data may be transferred. We will notify you of any Privacy Policy changes.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">4. Data Retention</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. Upon expiration, we securely delete or anonymize your data unless legal retention is required.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">5. Your Data Protection Rights</h2>
        <p className="text-gray-700 mb-6">As a user, you have specific rights regarding your personal data under data protection laws:</p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Access</h4>
            </div>
            <p className="text-sm text-gray-600">Request a copy of your personal information</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Rectification</h4>
            </div>
            <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM8 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Erasure</h4>
            </div>
            <p className="text-sm text-gray-600">Request deletion of your personal data</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Exercise Your Rights:</strong> To exercise any of these rights, please contact us using the information provided below.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">6. Security of Your Information</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="font-semibold text-green-900 mb-2">SSL Encryption</h4>
            <p className="text-sm text-green-800">Sensitive data encrypted during transmission</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">Access Control</h4>
            <p className="text-sm text-blue-800">Strict authorization for data access</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-purple-900 mb-2">PCI-DSS Compliant</h4>
            <p className="text-sm text-purple-800">Secure payment processing</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Security Notice:</strong> While we implement robust security measures, no system is entirely foolproof. We make every effort to protect your data but cannot guarantee absolute security.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">7. Cookies and Tracking Technologies</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Our Site uses cookies and tracking technologies (web beacons, pixel tags) to enhance user experience, analyze usage patterns, and personalize interactions.
          </p>
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Cookie Management:</strong> You can manage preferences through browser settings. Note that disabling cookies may affect platform functionality.
            </p>
            <p className="text-sm text-indigo-700">
              For detailed information, please refer to our <strong>Cookie Policy</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">8. Third-Party Links</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>External Links:</strong> Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before use.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">9. Children's Privacy</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>Age Restriction:</strong> We do not knowingly collect information from children under 16. If you believe we have collected such data, contact us immediately for deletion.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">10. Changes to This Privacy Policy</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm">
            We may update this Privacy Policy to reflect changes in practices, legal requirements, or services. Changes will be posted here with an updated "Effective Date". Please review periodically.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">11. Contact Us</h2>
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
