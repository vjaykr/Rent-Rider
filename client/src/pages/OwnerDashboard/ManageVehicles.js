import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../components/CustomToast';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { vehicleService } from '../../services/vehicleService';

const ManageVehicles = () => {
  const { user } = useSecureAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for now - replace with actual API call when backend is ready
  const mockVehicles = [
    {
      id: '1',
      name: 'Honda Activa 6G',
      brand: 'Honda',
      model: 'Activa 6G',
      year: '2023',
      type: 'scooter',
      fuelType: 'petrol',
      pricePerDay: 300,
      status: 'Available',
      bookings: 15,
      earnings: 4500,
      registrationNumber: 'MH12AB1234',
      location: 'Bandra West, Mumbai',
      features: ['Helmet Storage', 'Mobile Holder']
    },
    {
      id: '2',
      name: 'TVS Jupiter',
      brand: 'TVS',
      model: 'Jupiter',
      year: '2022',
      type: 'scooter',
      fuelType: 'petrol',
      pricePerDay: 250,
      status: 'Rented',
      bookings: 8,
      earnings: 2000,
      registrationNumber: 'MH12CD5678',
      location: 'Andheri East, Mumbai',
      features: ['GPS', 'USB Charging']
    },
    {
      id: '3',
      name: 'Royal Enfield Classic 350',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      year: '2023',
      type: 'motorcycle',
      fuelType: 'petrol',
      pricePerDay: 800,
      status: 'Available',
      bookings: 12,
      earnings: 9600,
      registrationNumber: 'MH14EF9012',
      location: 'Koregaon Park, Pune',
      features: ['Bluetooth', 'Anti-theft Alarm']
    }
  ];

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated and is owner
      if (!user || user.role !== 'owner') {
        showToast.error('Owner access required');
        setVehicles([]);
        return;
      }
      
      const response = await vehicleService.getOwnerVehicles();
      
      if (response.success) {
        setVehicles(response.data || []);
      } else {
        // Fallback to mock data if API fails
        setVehicles(mockVehicles);
        showToast.info('Using sample data. Connect to server for real data.');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        showToast.error('Authentication required. Please login as owner.');
        setVehicles([]);
      } else {
        setVehicles(mockVehicles);
        showToast.info('Using sample data. Check server connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);
  
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterStatus === 'all') return true;
    return vehicle.status.toLowerCase() === filterStatus.toLowerCase();
  });
  
  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await vehicleService.updateVehicle(vehicleId, { status: newStatus });
      
      if (response.success) {
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === vehicleId || vehicle._id === vehicleId 
            ? { ...vehicle, status: newStatus } 
            : vehicle
        ));
        showToast.success('Vehicle status updated successfully');
      } else {
        showToast.error(response.message || 'Failed to update vehicle status');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      showToast.error('Failed to update vehicle status');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }
    
    try {
      const response = await vehicleService.deleteVehicle(vehicleId);
      
      if (response.success) {
        setVehicles(prev => prev.filter(vehicle => 
          vehicle.id !== vehicleId && vehicle._id !== vehicleId
        ));
        showToast.success('Vehicle deleted successfully');
      } else {
        showToast.error(response.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      showToast.error('Failed to delete vehicle');
    }
  };
  


  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Rented':
        return 'text-blue-600 bg-blue-100';
      case 'Under Maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'Unavailable':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Vehicles</h1>
          <Link
            to="/owner/add-vehicle"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Vehicle
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Vehicles</h1>
        <Link
          to="/owner/add-vehicle"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Vehicle
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'available', 'rented', 'under maintenance'].map(status => (
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

      {/* Vehicle Cards */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'all' ? 'No vehicles found' : `No ${filterStatus} vehicles`}
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'all' && 'Start by adding your first vehicle!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-1">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                <p className="text-sm text-gray-500 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {vehicle.location}
                </p>
                <p className="text-blue-600 font-semibold mb-4">₹{vehicle.pricePerDay}/day</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Bookings</p>
                    <p className="font-semibold">{vehicle.bookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Earnings</p>
                    <p className="font-semibold">₹{vehicle.earnings}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => showToast.info('Edit feature coming soon!')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteVehicle(vehicle.id || vehicle._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleStatusChange(vehicle.id || vehicle._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageVehicles;
