import React, { useState, useEffect, useCallback } from 'react';
import { reportsAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/LoadingSpinner';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const reportTypes = [
    { id: 'revenue', label: 'Revenue Report', description: 'Monthly revenue breakdown' },
    { id: 'users', label: 'Users Report', description: 'User registration statistics' },
    { id: 'vehicles', label: 'Vehicles Report', description: 'Vehicle type distribution' },
    { id: 'bookings', label: 'Bookings Report', description: 'Booking status overview' },
  ];

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getReports(selectedReport, filters);
      setReportData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedReport, filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const renderRevenueReport = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Report</h3>
      <div className="space-y-4">
        {reportData?.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                {new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
              <p className="text-sm text-gray-600">{item.bookings} bookings</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(item.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersReport = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Users Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportData?.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{item.count}</p>
            <p className="text-sm text-gray-600 capitalize">{item._id}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVehiclesReport = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicles Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportData?.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{item.count}</p>
            <p className="text-sm text-gray-600 capitalize">{item._id}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingsReport = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportData?.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">{item.count}</p>
            <p className="text-sm text-gray-600 capitalize">{item._id.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReport = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner />
        </div>
      );
    }

    if (!reportData || reportData.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No data available for the selected report</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'revenue':
        return renderRevenueReport();
      case 'users':
        return renderUsersReport();
      case 'vehicles':
        return renderVehiclesReport();
      case 'bookings':
        return renderBookingsReport();
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view various reports for your platform</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900">{report.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </button>
            ))}
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Report Display */}
        {renderReport()}
      </div>
    </div>
  );
};

export default Reports;
