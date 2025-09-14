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
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            We collect personal information including user profile information, payment information, booking details, and usage data to provide our services effectively.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">2. Contact Us</h2>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}