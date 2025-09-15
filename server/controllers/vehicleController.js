const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Get all vehicles (public route - no authentication required)
const getVehicles = async (req, res) => {
  try {
    const {
      vehicleType,
      fuelType,
      location,
      latitude,
      longitude,
      radius = 5,
      availability = 'available',
      sortBy = 'price',
      page = 1,
      limit = 20
    } = req.query;

    // Build query - show all active vehicles (remove verification requirement for now)
    let query = {
      isActive: { $ne: false }  // Show all vehicles that are not explicitly inactive
    };
    
    // Only filter by availability if specified
    if (availability === 'available') {
      query['availability.isAvailable'] = true;
    }

    // Vehicle type filter
    if (vehicleType) {
      query.type = vehicleType;
    }

    // Fuel type filter
    if (fuelType) {
      query.fuelType = fuelType;
    }

    // Availability filter
    if (availability === 'available') {
      query['availability.isAvailable'] = true;
    }

    // Get vehicles from database
    let vehicles = await Vehicle.find(query)
      .populate('owner', 'firstName lastName email phone')
      .lean();

    // Location-based filtering (keep existing logic)
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      const searchRadius = parseFloat(radius);
      
      vehicles = vehicles.filter(vehicle => {
        if (vehicle.location && vehicle.location.coordinates &&
            vehicle.location.coordinates.latitude && vehicle.location.coordinates.longitude) {
          const distance = calculateDistance(
            userLat,
            userLon,
            vehicle.location.coordinates.latitude,
            vehicle.location.coordinates.longitude
          );
          vehicle.distance = Math.round(distance * 10) / 10;
          return distance <= searchRadius;
        }
        return false;
      });
    }

    // Location search by city/area name
    if (location && !latitude && !longitude) {
      vehicles = vehicles.filter(vehicle => {
        return vehicle.location && (
          vehicle.location.city?.toLowerCase().includes(location.toLowerCase()) ||
          vehicle.location.address?.toLowerCase().includes(location.toLowerCase()) ||
          vehicle.location.state?.toLowerCase().includes(location.toLowerCase())
        );
      });
    }

    // Sorting
    vehicles.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.pricing?.hourlyRate || 0) - (b.pricing?.hourlyRate || 0);
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedVehicles = vehicles.slice(startIndex, endIndex);

    // Response
    res.json({
      success: true,
      data: {
        vehicles: paginatedVehicles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(vehicles.length / limit),
          totalVehicles: vehicles.length,
          hasNext: endIndex < vehicles.length,
          hasPrev: startIndex > 0
        },
        searchInfo: {
          location: location || (latitude && longitude ? `${latitude}, ${longitude}` : null),
          radius: radius,
          resultsFound: vehicles.length
        }
      }
    });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// Get vehicle by ID (public route - no authentication required)
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id)
      .populate('owner', 'firstName lastName email phone')
      .lean();
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Don't show inactive vehicles to public
    if (vehicle.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not available'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error getting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
};

// Create new vehicle (for owners)
const createVehicle = async (req, res) => {
  try {
    // Handle both JSON and FormData
    const isFormData = req.headers['content-type']?.includes('multipart/form-data');
    
    let name, brand, model, type, year, fuelType, transmission, seatingCapacity;
    let pricing, location, features, description, availability;
    
    if (isFormData) {
      // Parse FormData fields
      name = req.body.name;
      brand = req.body.brand;
      model = req.body.model;
      type = req.body.type;
      year = req.body.year;
      fuelType = req.body.fuelType;
      transmission = req.body.transmission;
      seatingCapacity = req.body.seatingCapacity;
      location = req.body.location;
      description = req.body.description;
      availability = req.body.availability !== 'false';
      
      // Parse pricing from FormData
      pricing = {
        hourlyRate: req.body['pricing[hourlyRate]'],
        dailyRate: req.body['pricing[dailyRate]']
      };
      
      // Parse features array
      features = req.body['features[]'] ? 
        (Array.isArray(req.body['features[]']) ? req.body['features[]'] : [req.body['features[]']]) : [];
    } else {
      // Parse JSON data
      ({ name, brand, model, type, year, fuelType, transmission, seatingCapacity,
         pricing, location, features, description, availability } = req.body);
    }

    // Parse location to extract city and coordinates
    const locationData = {
      address: location,
      city: location.split(',').pop()?.trim() || 'Unknown',
      state: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 } // Default to Mumbai
    };

    // Process uploaded files
    const images = req.files?.images || [];
    const documents = {};
    
    // Process document files
    if (req.files) {
      ['registration', 'insurance', 'permit', 'puc'].forEach(docType => {
        const docField = `documents[${docType}]`;
        if (req.files[docField] && req.files[docField][0]) {
          documents[docType] = {
            url: `/uploads/documents/${req.files[docField][0].filename}`,
            originalName: req.files[docField][0].originalname,
            uploadedAt: new Date()
          };
        }
      });
    }

    const vehicleData = {
      name: name || `${brand} ${model}`,
      brand,
      model,
      type: type.toLowerCase(),
      year: parseInt(year),
      fuelType: fuelType.toLowerCase(),
      transmission,
      seatingCapacity: parseInt(seatingCapacity),
      pricing: {
        hourlyRate: parseInt(pricing.hourlyRate),
        dailyRate: parseInt(pricing.dailyRate),
        securityDeposit: parseInt(pricing.dailyRate) * 0.5 // 50% of daily rate
      },
      location: locationData,
      features: features || [],
      description: description || '',
      availability: { isAvailable: availability !== false },
      isActive: true,
      owner: req.user.userId || req.user.id,
      images: images.length > 0 
        ? images.map(file => ({
            url: `/uploads/vehicles/${file.filename}`,
            alt: `${brand} ${model}`
          }))
        : [{ url: '/api/placeholder/400/300', alt: `${brand} ${model}` }],
      documents,
      rating: { average: 0, count: 0 }
    };

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // Update user's vehicle count
    await User.findByIdAndUpdate(req.user.userId || req.user.id, {
      $inc: { totalVehicles: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully! Documents uploaded and vehicle is now visible to all users.',
      data: vehicle
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating vehicle: ' + error.message,
      error: error.message
    });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user is the owner
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user is the owner
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this vehicle'
      });
    }

    await Vehicle.findByIdAndDelete(id);

    // Update user's vehicle count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalVehicles: -1 }
    });

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

// Get vehicles by owner
const getVehiclesByOwner = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id })
      .populate('owner', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error getting owner vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// Add mock data for testing
const addMockData = async (req, res) => {
  try {
    // First, let's check if we already have mock data
    const existingVehicles = await Vehicle.countDocuments();
    if (existingVehicles > 0) {
      return res.json({
        success: true,
        message: 'Mock data already exists',
        count: existingVehicles
      });
    }

    // Create some mock users first (owners)
    const mockOwners = [
      { name: 'Rajesh Kumar', email: 'rajesh@example.com', rating: 4.9, totalVehicles: 0 },
      { name: 'Priya Sharma', email: 'priya@example.com', rating: 4.7, totalVehicles: 0 },
      { name: 'Amit Patel', email: 'amit@example.com', rating: 4.8, totalVehicles: 0 }
    ];

    const createdOwners = [];
    for (const owner of mockOwners) {
      const existingUser = await User.findOne({ email: owner.email });
      if (!existingUser) {
        const newUser = new User({
          ...owner,
          password: process.env.DEFAULT_OWNER_PASSWORD || 'temp_password_change_me',
          role: 'owner'
        });
        await newUser.save();
        createdOwners.push(newUser);
      } else {
        createdOwners.push(existingUser);
      }
    }

    // Mock vehicles with coordinates for different cities
    const mockVehicles = [
      // Mumbai vehicles
      {
        brand: 'Royal Enfield',
        model: 'Classic 350',
        type: 'motorcycle',
        year: 2023,
        registrationNumber: 'MH12AB1234',
        color: 'Black',
        fuelType: 'petrol',
        images: [{ url: '/api/placeholder/300/200', alt: 'Royal Enfield Classic 350' }],
        location: {
          address: 'Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400050',
          coordinates: { latitude: 19.0596, longitude: 72.8295 }
        },
        pricing: {
          hourlyRate: 100,
          dailyRate: 800,
          securityDeposit: 2000
        },
        owner: createdOwners[0]._id,
        features: ['GPS', 'Bluetooth', 'USB Charging']
      },
      {
        brand: 'Honda',
        model: 'Activa 6G',
        type: 'scooter',
        year: 2022,
        registrationNumber: 'MH01CD5678',
        color: 'White',
        fuelType: 'petrol',
        images: [{ url: '/api/placeholder/300/200', alt: 'Honda Activa 6G' }],
        location: {
          address: 'Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400069',
          coordinates: { latitude: 19.1136, longitude: 72.8697 }
        },
        pricing: {
          hourlyRate: 60,
          dailyRate: 400,
          securityDeposit: 1000
        },
        owner: createdOwners[1]._id,
        features: ['Helmet Storage', 'Mobile Holder']
      },
      // Bangalore vehicles
      {
        brand: 'Bajaj',
        model: 'Pulsar NS200',
        type: 'motorcycle',
        year: 2023,
        registrationNumber: 'KA03EF9012',
        color: 'Blue',
        fuelType: 'petrol',
        images: [{ url: '/api/placeholder/300/200', alt: 'Bajaj Pulsar NS200' }],
        location: {
          address: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560034',
          coordinates: { latitude: 12.9279, longitude: 77.6271 }
        },
        pricing: {
          hourlyRate: 80,
          dailyRate: 600,
          securityDeposit: 1500
        },
        owner: createdOwners[2]._id,
        features: ['Anti-theft Alarm', 'USB Charging']
      }
    ];

    // Insert mock vehicles
    const createdVehicles = await Vehicle.insertMany(mockVehicles);

    // Update owner vehicle counts
    for (const owner of createdOwners) {
      const vehicleCount = mockVehicles.filter(v => v.owner.equals(owner._id)).length;
      await User.findByIdAndUpdate(owner._id, { totalVehicles: vehicleCount });
    }

    res.json({
      success: true,
      message: 'Mock data added successfully',
      data: {
        vehiclesCreated: createdVehicles.length,
        ownersCreated: createdOwners.length
      }
    });
  } catch (error) {
    console.error('Error adding mock data:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding mock data',
      error: error.message
    });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByOwner,
  addMockData
};
