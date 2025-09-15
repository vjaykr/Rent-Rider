import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Company Info - Full width on mobile */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold">RentRider</span>
            </div>
            <p className="text-gray-300 text-sm lg:text-base mb-4">
              Your trusted platform for bike rentals. Find the perfect ride for your journey.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.275c-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/vehicles" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Browse Bikes</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">How it Works</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Help Center</Link></li>
              <li><a href="mailto:support@rentrider.com" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Email Support</a></li>
              <li><a href="tel:+911234567890" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Phone Support</a></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Cookie Policy</Link></li>
              <li><Link to="/refund-policy" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-300 text-sm text-center sm:text-left">
              © 2024 RentRider. All rights reserved.
            </p>
            
            {/* Mobile-friendly legal links */}
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 lg:space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-xs lg:text-sm transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-xs lg:text-sm transition-colors">Terms</Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-white text-xs lg:text-sm transition-colors">Cookies</Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-white text-xs lg:text-sm transition-colors">Refunds</Link>
            </div>
          </div>
          
          {/* App download section for mobile */}
          <div className="mt-4 pt-4 border-t border-gray-800 sm:hidden">
            <p className="text-gray-400 text-xs text-center mb-2">Download our mobile app</p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="inline-block">
                <img src="/images/app-store.png" alt="Download on App Store" className="h-8" />
              </a>
              <a href="#" className="inline-block">
                <img src="/images/google-play.png" alt="Get it on Google Play" className="h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;