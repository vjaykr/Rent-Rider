import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ownerService } from '../../services/ownerService';
import { format } from 'date-fns';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});
  const [statusLoading, setStatusLoading] = useState({});
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await ownerService.getOwnerVehicles();
      if (response.success) {
        setVehicles(response.data.vehicles || []);
      } else {
        toast.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('An error occurred while fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);
  
  const filteredAndSortedVehicles = useMemo(() => {
    // Filter vehicles
    let result = [...vehicles];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(vehicle => 
        vehicle.availability?.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.name?.toLowerCase().includes(term) ||
        vehicle.brand?.toLowerCase().includes(term) ||
        vehicle.model?.toLowerCase().includes(term) ||
        vehicle.registrationNumber?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }
        
        // Convert to string and lowercase for case-insensitive comparison
        if (typeof aValue === 'string') aValue = aValue.toString().toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toString().toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [vehicles, filterStatus, searchTerm, sortConfig]);
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      setStatusLoading(prev => ({ ...prev, [vehicleId]: true }));
      
      const response = await ownerService.updateVehicle(vehicleId, {
        'availability.status': newStatus
      });
      
      if (response.success) {
        await fetchVehicles();
        toast.success('Vehicle status updated successfully');
      } else {
        toast.error(response.message || 'Failed to update vehicle status');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast.error('An error occurred while updating vehicle status');
    } finally {
      setStatusLoading(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(prev => ({ ...prev, [vehicleId]: true }));
      
      const response = await ownerService.deleteVehicle(vehicleId);
      
      if (response.success) {
        await fetchVehicles();
        toast.success('Vehicle deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('An error occurred while deleting the vehicle');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [vehicleId]: false }));
    }
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      available: { text: 'Available', color: 'bg-green-100 text-green-800' },
      rented: { text: 'Rented', color: 'bg-blue-100 text-blue-800' },
      maintenance: { text: 'Under Maintenance', color: 'bg-yellow-100 text-yellow-800' },
      unavailable: { text: 'Unavailable', color: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };
  
  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      { value: 'available', label: 'Available' },
      { value: 'rented', label: 'Rented' },
      { value: 'maintenance', label: 'Under Maintenance' },
      { value: 'unavailable', label: 'Unavailable' },
    ];
    
    return allStatuses.map(option => ({
      ...option,
      disabled: option.value === currentStatus?.toLowerCase()
    }));
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
      {filteredAndSortedVehicles.length === 0 ? (
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
          {filteredAndSortedVehicles.map((vehicle) => (
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
                
                <p className="text-gray-600 mb-2">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
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
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
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
