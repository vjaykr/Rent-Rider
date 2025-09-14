import React, { useState } from 'react';
import { useSecureAuth } from '../context/SecureAuthContext';

const Support = () => {
  const { user } = useSecureAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement ticket submission
    console.log('Ticket submitted:', ticketForm);
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const faqData = [
    {
      id: 1,
      question: "How do I rent a vehicle?",
      answer: "To rent a vehicle, simply search for available vehicles in your area, select your preferred dates and times, and complete the booking process with payment."
    },
    {
      id: 2,
      question: "What documents do I need to rent a vehicle?",
      answer: "You need a valid driving license, government-issued ID (Aadhaar/PAN), and a debit/credit card for payment."
    },
    {
      id: 3,
      question: "How can I cancel my booking?",
      answer: "You can cancel your booking up to 1 hour before the start time through the app. Cancellation charges may apply based on the timing."
    },
    {
      id: 4,
      question: "What if I face issues during my ride?",
      answer: "Contact our 24/7 support team immediately through the app or call our helpline. We're here to help you resolve any issues quickly."
    },
    {
      id: 5,
      question: "How do I become a vehicle owner on the platform?",
      answer: "To list your vehicle, register as an owner, complete the verification process, and add your vehicle details with photos."
    }
  ];

  const ticketCategories = [
    { value: '', label: 'Select Category' },
    { value: 'booking', label: 'Booking Issues' },
    { value: 'payment', label: 'Payment Problems' },
    { value: 'vehicle', label: 'Vehicle Issues' },
    { value: 'account', label: 'Account Support' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">We're here to help you with any questions or issues</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Support</h3>
            <p className="text-gray-600 text-sm mb-4">24/7 phone support</p>
            <a href="tel:+911234567890" className="text-blue-600 hover:text-blue-700 font-medium">
              +91 123 456 7890
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Chat with our support team</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">Send us an email</p>
            <a href="mailto:support@rentrider.com" className="text-blue-600 hover:text-blue-700 font-medium">
              support@rentrider.com
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ticket'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Submit Ticket
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'status'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Ticket Status
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqData.map(faq => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ticket' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Submit a Support Ticket</h3>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {ticketCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">My Support Tickets</h3>
                <div className="space-y-4">
                  {user ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h4>
                      <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Please log in to view your support tickets.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
