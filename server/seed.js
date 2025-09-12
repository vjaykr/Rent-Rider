const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rentrider', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    // Create sample users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      users.push({
        firstName: `User`,
        lastName: `${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        phone: `${9000000000 + i}`,
        dateOfBirth: new Date(`199${i % 10}-01-01`),
        gender: i % 2 === 0 ? 'male' : 'female',
        address: {
          street: `Street ${i}`,
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        isVerified: i % 3 !== 0, // Some users not verified
        isActive: i % 5 !== 0, // Some users inactive
      });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    users.push({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@rentrider.com',
      password: adminPassword,
      phone: '9999999999',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      role: 'admin',
      address: {
        street: 'Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      isVerified: true,
      isActive: true,
    });

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create sample vehicles
    const vehicles = [];
    const vehicleTypes = ['bicycle', 'motorcycle', 'scooter', 'electric-bike', 'electric-scooter'];
    const brands = ['Honda', 'Bajaj', 'TVS', 'Yamaha', 'Hero', 'Suzuki'];
    const models = ['City', 'Activa', 'Splendor', 'FZ', 'Passion', 'Access'];
    const fuelTypes = ['petrol', 'electric', 'hybrid', 'manual'];
    const locations = [
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 19.0825, lng: 72.8428 }, // Bandra
      { lat: 19.0330, lng: 72.8296 }, // Worli
    ];

    for (let i = 1; i <= 20; i++) {
      const owner = createdUsers[Math.floor(Math.random() * (createdUsers.length - 1))]; // Exclude admin
      const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const model = models[Math.floor(Math.random() * models.length)];
      const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      vehicles.push({
        owner: owner._id,
        brand,
        model,
        type,
        category: ['standard', 'premium', 'luxury', 'sports'][i % 4],
        year: 2020 + (i % 4),
        registrationNumber: `MH01${String(1000 + i).padStart(4, '0')}`,
        color: ['Red', 'Blue', 'White', 'Black', 'Silver'][i % 5],
        fuelType,
        engineCapacity: type === 'bicycle' ? 0 : 100 + (i % 200),
        images: [
          {
            url: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Vehicle+Image+1',
            alt: 'Vehicle front view',
            isPrimary: true
          },
          {
            url: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Vehicle+Image+2',
            alt: 'Vehicle side view',
            isPrimary: false
          },
        ],
        description: `A well-maintained ${brand} ${model} available for rent in Mumbai.`,
        features: ['GPS', 'Bluetooth', 'LED lights'].slice(0, (i % 3) + 1),
        location: {
          address: `Location ${i}, Mumbai`,
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          coordinates: {
            latitude: location.lat,
            longitude: location.lng,
          }
        },
        pricing: {
          hourlyRate: 50 + (i % 50),
          dailyRate: 500 + (i % 500),
          weeklyRate: 3000 + (i % 1000),
          monthlyRate: 10000 + (i % 5000),
          securityDeposit: 1000 + (i % 2000),
        },
        availability: {
          isAvailable: i % 4 !== 0,
          unavailableDates: []
        },
        rating: {
          average: 4 + (i % 5) / 5,
          count: i % 20,
        },
        totalBookings: i % 50,
        documents: {
          registrationCertificate: 'https://via.placeholder.com/400x300/dc3545/ffffff?text=Registration',
          insurance: {
            policyNumber: `INS${1000 + i}`,
            expiryDate: new Date('2025-12-31'),
            documentUrl: 'https://via.placeholder.com/400x300/ffc107/ffffff?text=Insurance',
          },
          pollution: {
            certificateNumber: `PUC${1000 + i}`,
            expiryDate: new Date('2025-06-30'),
            documentUrl: 'https://via.placeholder.com/400x300/17a2b8/ffffff?text=Pollution',
          }
        },
        verification: {
          isVerified: i % 3 !== 0,
          verifiedAt: i % 3 !== 0 ? new Date() : null,
          verificationNotes: i % 3 !== 0 ? 'Documents verified successfully' : null,
        },
        isActive: i % 5 !== 0,
      });
    }

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Created ${createdVehicles.length} vehicles`);

    console.log('Database seeded successfully!');
    console.log('You can now test the admin panel with:');
    console.log('- Admin login: admin@rentrider.com / admin123');
    console.log('- Users: user1@example.com to user10@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
