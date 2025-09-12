import React from 'react';
import PrivacyPolicy from './Legal/Privacy_Policy';
import TermsOfService from './Legal/Terms_Of_Service';
import CookiePolicy from './Legal/Cookie_Policy';

const LegalModal = ({ isOpen, onClose, type, title }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'cookies':
        return <CookiePolicy />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-800">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;