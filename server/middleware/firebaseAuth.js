const { verifyIdToken } = require('../config/firebase');

// Middleware to verify Firebase ID token
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const idToken = authHeader.split(' ')[1];
    
    const result = await verifyIdToken(idToken);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: result.error
      });
    }
    
    // Add user info to request object
    req.firebaseUser = {
      uid: result.uid,
      email: result.email,
      phoneNumber: result.phoneNumber,
      decodedToken: result.decodedToken
    };
    
    next();
  } catch (error) {
    console.error('Firebase authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Optional Firebase authentication middleware
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split(' ')[1];
      const result = await verifyIdToken(idToken);
      
      if (result.success) {
        req.firebaseUser = {
          uid: result.uid,
          email: result.email,
          phoneNumber: result.phoneNumber,
          decodedToken: result.decodedToken
        };
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional Firebase authentication error:', error);
    next(); // Continue without authentication
  }
};

module.exports = {
  authenticateFirebaseToken,
  optionalFirebaseAuth
};
