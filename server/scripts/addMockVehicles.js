const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentrider');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addMockVehicles = async () => {
  try {
    await connectDB();

    // Check if vehicles already exist
    const existingVehicles = await Vehicle.countDocuments();
    if (existingVehicles > 0) {
      console.log(`${existingVehicles} vehicles already exist. Skipping mock data creation.`);
      return;
    }

    // Create mock owners
    const mockOwners = [
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.owner@example.com',
        password: process.env.DEFAULT_OWNER_PASSWORD || 'temp_password_change_me',
        role: 'owner',
        phone: '+919876543210',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileComplete: true
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.owner@example.com',
        password: process.env.DEFAULT_OWNER_PASSWORD || 'temp_password_change_me',
        role: 'owner',
        phone: '+919876543211',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileComplete: true
      },
      {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.owner@example.com',
        password: process.env.DEFAULT_OWNER_PASSWORD || 'temp_password_change_me',
        role: 'owner',
        phone: '+919876543212',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileComplete: true
      }
    ];

    const createdOwners = [];
    for (const ownerData of mockOwners) {
      let owner = await User.findOne({ email: ownerData.email });
      if (!owner) {
        owner = new User(ownerData);
        await owner.save();
      }
      createdOwners.push(owner);
    }

    // Mock vehicles data
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
        images: [
          { url: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Royal+Enfield+Classic+350', alt: 'Royal Enfield Classic 350' }
        ],
        location: {
          address: 'Bandra West, Mumbai',
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
        features: ['GPS', 'Bluetooth', 'USB Charging'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.8, count: 156 }
      },
      {
        brand: 'Honda',
        model: 'Activa 6G',
        type: 'scooter',
        year: 2023,
        registrationNumber: 'MH01CD5678',
        color: 'White',
        fuelType: 'petrol',
        images: [
          { url: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Honda+Activa+6G', alt: 'Honda Activa 6G' }
        ],
        location: {
          address: 'Andheri East, Mumbai',
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
        features: ['Helmet Storage', 'Mobile Holder'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.6, count: 234 }
      },
      {
        brand: 'TVS',
        model: 'Jupiter',
        type: 'scooter',
        year: 2022,
        registrationNumber: 'MH14EF9012',
        color: 'Blue',
        fuelType: 'petrol',
        images: [
          { url: 'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=TVS+Jupiter', alt: 'TVS Jupiter' }
        ],
        location: {
          address: 'Powai, Mumbai',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400076',
          coordinates: { latitude: 19.1197, longitude: 72.9056 }
        },
        pricing: {
          hourlyRate: 50,
          dailyRate: 350,
          securityDeposit: 800
        },
        owner: createdOwners[2]._id,
        features: ['GPS', 'USB Charging'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.4, count: 89 }
      },
      // Bangalore vehicles
      {
        brand: 'Bajaj',
        model: 'Pulsar NS200',
        type: 'motorcycle',
        year: 2023,
        registrationNumber: 'KA03EF9012',
        color: 'Red',
        fuelType: 'petrol',
        images: [
          { url: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Bajaj+Pulsar+NS200', alt: 'Bajaj Pulsar NS200' }
        ],
        location: {
          address: 'Koramangala, Bangalore',
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
        owner: createdOwners[0]._id,
        features: ['Anti-theft Alarm', 'USB Charging'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.5, count: 123 }
      },
      {
        brand: 'Yamaha',
        model: 'FZ-S',
        type: 'motorcycle',
        year: 2023,
        registrationNumber: 'KA05GH3456',
        color: 'Black',
        fuelType: 'petrol',
        images: [
          { url: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Yamaha+FZ-S', alt: 'Yamaha FZ-S' }
        ],
        location: {
          address: 'Whitefield, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560066',
          coordinates: { latitude: 12.9698, longitude: 77.7500 }
        },
        pricing: {
          hourlyRate: 90,
          dailyRate: 700,
          securityDeposit: 1800
        },
        owner: createdOwners[1]._id,
        features: ['Bluetooth', 'LED Headlights', 'Digital Display'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.7, count: 98 }
      },
      // Delhi vehicles
      {
        brand: 'Hero',
        model: 'Splendor Plus',
        type: 'motorcycle',
        year: 2022,
        registrationNumber: 'DL08IJ7890',
        color: 'Red',
        fuelType: 'petrol',
        images: [
          { url: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Hero+Splendor+Plus', alt: 'Hero Splendor Plus' }
        ],
        location: {
          address: 'Connaught Place, Delhi',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          coordinates: { latitude: 28.6315, longitude: 77.2167 }
        },
        pricing: {
          hourlyRate: 70,
          dailyRate: 500,
          securityDeposit: 1200
        },
        owner: createdOwners[2]._id,
        features: ['Fuel Efficient', 'Comfortable Seat'],
        availability: { isAvailable: true },
        isActive: true,
        rating: { average: 4.3, count: 67 }
      }
    ];

    // Insert vehicles
    const createdVehicles = await Vehicle.insertMany(mockVehicles);
    console.log(`✅ Successfully created ${createdVehicles.length} mock vehicles`);

    // Update owner vehicle counts
    for (const owner of createdOwners) {
      const vehicleCount = mockVehicles.filter(v => v.owner.equals(owner._id)).length;
      await User.findByIdAndUpdate(owner._id, { totalVehicles: vehicleCount });
    }

    console.log('✅ Mock data setup completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Owners created: ${createdOwners.length}`);
    console.log(`   - Vehicles created: ${createdVehicles.length}`);
    console.log(`   - Cities covered: Mumbai, Bangalore, Delhi`);

  } catch (error) {
    console.error('❌ Error adding mock vehicles:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
if (require.main === module) {
  addMockVehicles();
}

module.exports = addMockVehicles;