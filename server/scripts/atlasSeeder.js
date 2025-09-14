const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data for seeding
const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@rentrider.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin',
    dateOfBirth: new Date('1990-01-01'),
    address: {
      street: '123 Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '9876543211',
    password: 'password123',
    role: 'owner',
    dateOfBirth: new Date('1985-05-15'),
    address: {
      street: '456 Owner Lane',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    ownerDetails: {
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      businessName: 'John\'s Bike Rentals',
      businessLicense: 'BL123456789',
      bankDetails: {
        accountNumber: '1234567890123456',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'John Doe'
      },
      isVerified: true
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '9876543212',
    password: 'password123',
    role: 'customer',
    dateOfBirth: new Date('1992-08-20'),
    address: {
      street: '789 Customer Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    drivingLicense: {
      number: 'DL1234567890',
      expiryDate: new Date('2025-12-31'),
      verified: true
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true
  }
];

const sampleVehicles = [
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    type: 'motorcycle',
    category: 'standard',
    year: 2022,
    registrationNumber: 'MH01AB1234',
    color: 'Black',
    fuelType: 'petrol',
    engineCapacity: 349,
    images: [
      {
        url: 'https://example.com/bike1-1.jpg',
        alt: 'Royal Enfield Classic 350 - Front View',
        isPrimary: true
      },
      {
        url: 'https://example.com/bike1-2.jpg',
        alt: 'Royal Enfield Classic 350 - Side View',
        isPrimary: false
      }
    ],
    description: 'Classic motorcycle perfect for city rides and short trips',
    features: ['Electric Start', 'Disc Brakes', 'LED Headlight', 'Digital Console'],
    location: {
      address: '123 Bike Street, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400058',
      coordinates: {
        latitude: 19.1136,
        longitude: 72.8697
      }
    },
    pricing: {
      hourlyRate: 150,
      dailyRate: 800,
      weeklyRate: 5000,
      monthlyRate: 18000,
      securityDeposit: 5000
    },
    availability: {
      isAvailable: true,
      unavailableDates: []
    },
    documents: {
      registrationCertificate: 'https://example.com/rc1.pdf',
      insurance: {
        policyNumber: 'INS123456789',
        expiryDate: new Date('2024-12-31'),
        documentUrl: 'https://example.com/insurance1.pdf'
      },
      pollution: {
        certificateNumber: 'PUC123456789',
        expiryDate: new Date('2024-06-30'),
        documentUrl: 'https://example.com/puc1.pdf'
      }
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date(),
      verificationNotes: 'All documents verified and vehicle inspected'
    },
    isActive: true
  },
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    model: 'Activa 6G',
    type: 'scooter',
    category: 'standard',
    year: 2023,
    registrationNumber: 'DL08CA5678',
    color: 'White',
    fuelType: 'petrol',
    engineCapacity: 109.51,
    images: [
      {
        url: 'https://example.com/scooter1-1.jpg',
        alt: 'Honda Activa 6G - Front View',
        isPrimary: true
      }
    ],
    description: 'Reliable scooter for daily commuting',
    features: ['Fuel Injection', 'LED Headlight', 'Mobile Charging Port', 'Under Seat Storage'],
    location: {
      address: '456 Scooter Lane, Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      coordinates: {
        latitude: 28.6315,
        longitude: 77.2167
      }
    },
    pricing: {
      hourlyRate: 80,
      dailyRate: 400,
      weeklyRate: 2500,
      monthlyRate: 9000,
      securityDeposit: 3000
    },
    availability: {
      isAvailable: true,
      unavailableDates: []
    },
    documents: {
      registrationCertificate: 'https://example.com/rc2.pdf',
      insurance: {
        policyNumber: 'INS987654321',
        expiryDate: new Date('2024-12-31'),
        documentUrl: 'https://example.com/insurance2.pdf'
      },
      pollution: {
        certificateNumber: 'PUC987654321',
        expiryDate: new Date('2024-06-30'),
        documentUrl: 'https://example.com/puc2.pdf'
      }
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date(),
      verificationNotes: 'All documents verified and vehicle inspected'
    },
    isActive: true
  }
];

// Seeder functions
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Existing users deleted');

    const users = await User.create(sampleUsers);
    console.log(`${users.length} users created successfully`);
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedVehicles = async (users) => {
  try {
    await Vehicle.deleteMany({});
    console.log('Existing vehicles deleted');

    // Assign owners to vehicles
    const owner = users.find(user => user.role === 'owner');
    const vehiclesWithOwner = sampleVehicles.map(vehicle => ({
      ...vehicle,
      owner: owner._id
    }));

    const vehicles = await Vehicle.create(vehiclesWithOwner);
    console.log(`${vehicles.length} vehicles created successfully`);
    return vehicles;
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    throw error;
  }
};

const seedBookings = async (users, vehicles) => {
  try {
    await Booking.deleteMany({});
    console.log('Existing bookings deleted');

    const customer = users.find(user => user.role === 'customer');
    const owner = users.find(user => user.role === 'owner');
    const vehicle = vehicles[0];

    const sampleBooking = {
      customer: customer._id,
      vehicle: vehicle._id,
      owner: owner._id,
      // bookingId will be auto-generated by pre-save middleware
      duration: {
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        startTime: '10:00',
        endTime: '18:00'
      },
      pricing: {
        rateType: 'daily',
        baseRate: vehicle.pricing.dailyRate,
        quantity: 1,
        subtotal: vehicle.pricing.dailyRate,
        taxes: {
          gst: vehicle.pricing.dailyRate * 0.18,
          serviceTax: 0
        },
        securityDeposit: vehicle.pricing.securityDeposit,
        totalAmount: vehicle.pricing.dailyRate + (vehicle.pricing.dailyRate * 0.18) + vehicle.pricing.securityDeposit,
        discount: {
          amount: 0
        }
      },
      status: 'confirmed',
      pickup: {
        location: {
          address: vehicle.location.address,
          coordinates: vehicle.location.coordinates
        },
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000) // Tomorrow 10 AM
      },
      dropoff: {
        location: {
          address: vehicle.location.address,
          coordinates: vehicle.location.coordinates
        },
        scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000) // Day after tomorrow 6 PM
      }
    };

    const booking = await Booking.create(sampleBooking);
    console.log('Sample booking created successfully');
    return [booking];
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const users = await seedUsers();
    const vehicles = await seedVehicles(users);
    const bookings = await seedBookings(users, vehicles);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created: ${users.length} users, ${vehicles.length} vehicles, ${bookings.length} bookings`);
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedVehicles, seedBookings };