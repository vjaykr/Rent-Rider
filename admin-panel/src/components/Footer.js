import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 RentRider Admin Panel. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-gray-600 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-gray-600 text-sm">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-gray-600 text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;