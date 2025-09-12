import React from "react";

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> January 1, 2025
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          At <strong>Rent Rider</strong> ("we," "us," "our"), we value your privacy and are committed to being transparent about how we collect and use your information. This Cookie Policy explains what cookies are, how we use them, and how you can manage or control them when using our Platform.
        </p>
        <p className="text-gray-700 leading-relaxed">
          By using our Platform, you consent to the use of cookies in accordance with this Cookie Policy.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">1. What are Cookies?</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files placed on your device when you visit a website or use an application. These cookies allow the website to recognize your device and store information about your session, preferences, and browsing activities.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. Types of Cookies We Use</h2>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              2.1 Essential Cookies
            </h3>
            <p className="text-red-800 text-sm mb-3">Necessary for proper Platform functioning and cannot be switched off.</p>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Authentication cookies (to keep users logged in)</li>
              <li>• Session cookies (to manage user activity during visits)</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              2.2 Performance and Analytics Cookies
            </h3>
            <p className="text-blue-800 text-sm mb-3">Help us understand user interactions and improve Platform performance.</p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Google Analytics cookies (track user activity and interactions)</li>
              <li>• Hotjar or similar services for behavior analytics</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </div>
              2.3 Functional Cookies
            </h3>
            <p className="text-green-800 text-sm mb-3">Remember your choices and provide enhanced, personalized features.</p>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Language preferences</li>
              <li>• Customizable settings and user interface preferences</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              2.4 Advertising and Targeting Cookies
            </h3>
            <p className="text-purple-800 text-sm mb-3">Deliver relevant ads based on your browsing behavior and measure campaign effectiveness.</p>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Google AdSense cookies (personalized ads)</li>
              <li>• Facebook Pixel for targeted advertising</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-medium text-orange-900 mb-3 flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
              </div>
              2.5 Third-Party Cookies
            </h3>
            <p className="text-orange-800 text-sm mb-3">Placed by third-party service providers for payments, analytics, and social media.</p>
            <ul className="space-y-1 text-sm text-orange-700">
              <li>• Stripe or Razorpay cookies for payment processing</li>
              <li>• Social media cookies (Facebook, Twitter) for sharing functionality</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">3. How We Use Cookies</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Service Enhancement</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Provide seamless user experience</li>
              <li>• Remember preferences and login status</li>
              <li>• Maintain language selection</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">Analytics & Improvement</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Analyze user behavior and interactions</li>
              <li>• Understand page visits and feature usage</li>
              <li>• Improve website functionality</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3">Personalization</h4>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Deliver personalized content</li>
              <li>• Show relevant advertising</li>
              <li>• Customize user experience</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3">Security & Payments</h4>
            <ul className="space-y-2 text-sm text-orange-800">
              <li>• Prevent fraudulent activities</li>
              <li>• Secure transaction environment</li>
              <li>• Support payment processes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">4. Cookie Consent and Control</h2>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-900 mb-3">4.1 Cookie Banner</h3>
            <p className="text-yellow-800 text-sm">When you visit the Platform, you'll see a cookie banner where you can accept or decline non-essential cookies. Essential cookies cannot be declined as they're necessary for Platform functionality.</p>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-indigo-900 mb-3">4.2 Managing Cookie Preferences</h3>
            <p className="text-indigo-800 text-sm mb-3">Control cookies through your browser settings:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="space-y-1 text-sm text-indigo-700">
                <li>• <strong>Chrome:</strong> Settings > Privacy and security > Cookies</li>
                <li>• <strong>Firefox:</strong> Options > Privacy & Security > Cookies</li>
              </ul>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li>• <strong>Safari:</strong> Preferences > Privacy > Cookies</li>
                <li>• <strong>Edge:</strong> Settings > Privacy > Cookies</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-900 mb-3">4.3 Opting Out of Targeted Advertising</h3>
            <p className="text-green-800 text-sm mb-3">Opt-out of personalized advertising:</p>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• <strong>Google Ads:</strong> adssettings.google.com</li>
              <li>• <strong>Facebook Ads:</strong> facebook.com/settings/?tab=ads</li>
            </ul>
            <p className="text-green-700 text-xs mt-2">Note: Opting out won't eliminate ads, but they may not be tailored to your interests.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">5. Changes to This Cookie Policy</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm">
            We may update this Cookie Policy to reflect changes in technology, regulations, or business practices. Updates will be posted here with an updated "Effective Date". Please review periodically.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">6. Contact Us</h2>
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