const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Too many files uploaded';
    error = { message, statusCode: 400 };
  }

  // Razorpay errors
  if (err.error && err.error.code) {
    switch (err.error.code) {
      case 'BAD_REQUEST_ERROR':
        error = { message: 'Payment request error', statusCode: 400 };
        break;
      case 'GATEWAY_ERROR':
        error = { message: 'Payment gateway error', statusCode: 502 };
        break;
      case 'SERVER_ERROR':
        error = { message: 'Payment service unavailable', statusCode: 503 };
        break;
      default:
        error = { message: 'Payment processing error', statusCode: 500 };
    }
  }

  // Firebase errors
  if (err.code && err.code.startsWith('storage/')) {
    switch (err.code) {
      case 'storage/object-not-found':
        error = { message: 'File not found', statusCode: 404 };
        break;
      case 'storage/unauthorized':
        error = { message: 'Unauthorized file access', statusCode: 403 };
        break;
      case 'storage/quota-exceeded':
        error = { message: 'Storage quota exceeded', statusCode: 413 };
        break;
      default:
        error = { message: 'File storage error', statusCode: 500 };
    }
  }

  // Rate limiting errors
  if (err.message && err.message.includes('Too many requests')) {
    error = { message: 'Too many requests, please try again later', statusCode: 429 };
  }

  // Database connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    error = { message: 'Database connection error', statusCode: 503 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Additional error details for development
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack
    })
  };

  res.status(statusCode).json(errorResponse);
};

// 404 error handler
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response helper
const sendErrorResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(data && { data })
  });
};

// Success response helper
const sendSuccessResponse = (res, statusCode = 200, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  AppError,
  sendErrorResponse,
  sendSuccessResponse
};
