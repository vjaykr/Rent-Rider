import React, { useState, useEffect } from 'react';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching bookings
    setTimeout(() => {
      setBookings([
        {
          id: 'BK001',
          vehicleName: 'Royal Enfield Classic 350',
          renterName: 'John Doe',
          renterPhone: '+91 9876543210',
          startDate: '2024-03-15',
          endDate: '2024-03-17',
          startTime: '10:00',
          endTime: '18:00',
          amount: 2400,
          status: 'Active',
          pickupLocation: 'MG Road, Bangalore'
        },
        {
          id: 'BK002',
          vehicleName: 'Honda Activa 6G',
          renterName: 'Jane Smith',
          renterPhone: '+91 9876543211',
          startDate: '2024-03-14',
          endDate: '2024-03-14',
          startTime: '09:00',
          endTime: '17:00',
          amount: 400,
          status: 'Completed',
          pickupLocation: 'Koramangala, Bangalore'
        },
        {
          id: 'BK003',
          vehicleName: 'Bajaj Pulsar NS200',
          renterName: 'Mike Johnson',
          renterPhone: '+91 9876543212',
          startDate: '2024-03-20',
          endDate: '2024-03-22',
          startTime: '11:00',
          endTime: '19:00',
          amount: 1800,
          status: 'Confirmed',
          pickupLocation: 'Indiranagar, Bangalore'
        },
        {
          id: 'BK004',
          vehicleName: 'Royal Enfield Classic 350',
          renterName: 'Sarah Wilson',
          renterPhone: '+91 9876543213',
          startDate: '2024-03-10',
          endDate: '2024-03-11',
          startTime: '08:00',
          endTime: '20:00',
          amount: 1600,
          status: 'Cancelled',
          pickupLocation: 'Whitefield, Bangalore'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'Completed':
        return 'text-gray-600 bg-gray-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings Management</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'confirmed', 'active', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'all' ? 'No bookings found' : `No ${filterStatus} bookings`}
          </h3>
          <p className="text-gray-600">Bookings will appear here once customers start renting your vehicles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{booking.vehicleName}</h3>
                  <p className="text-gray-600">Booking ID: {booking.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    disabled={booking.status === 'Completed' || booking.status === 'Cancelled'}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Renter Details</h4>
                  <p className="text-sm text-gray-600">{booking.renterName}</p>
                  <p className="text-sm text-gray-600">{booking.renterPhone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Amount & Location</h4>
                  <p className="text-sm font-semibold text-gray-900">₹{booking.amount}</p>
                  <p className="text-sm text-gray-600">{booking.pickupLocation}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  View Details
                </button>
                
                {booking.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'Active')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Start Rental
                  </button>
                )}
                
                {booking.status === 'Active' && (
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'Completed')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Complete Rental
                  </button>
                )}
                
                {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        handleStatusChange(booking.id, 'Cancelled');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
