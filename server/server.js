const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection and Firebase
const connectDB = require('./config/db');
const { initializeFirebase } = require('./config/firebase');

// Import routes
const authRoutes = require('./routes/authRoutes');
const unifiedAuthRoutes = require('./routes/unifiedAuthRoutes');
const secureAuthRoutes = require('./routes/secureAuthRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 1000), // limit each IP to 1000 requests per windowMs in dev
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    /^http:\/\/.*:3000$/,
    /^http:\/\/.*:3001$/,
    /^http:\/\/.*:5001$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for HTTP-only cookies
app.use(cookieParser());

// Connect to MongoDB Atlas
connectDB();

// Initialize Firebase
initializeFirebase();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'RentRider API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', secureAuthRoutes); // New secure auth system
app.use('/api/auth-unified', unifiedAuthRoutes); // Unified auth system
app.use('/api/auth-legacy', authRoutes); // Keep legacy routes for migration
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owners', ownerRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
});

module.exports = app;
