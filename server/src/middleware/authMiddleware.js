import firebaseAdmin from '../config/firebaseAdmin.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || '',
        photoURL: decodedToken.picture || ''
      });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      userId: user._id,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      data: null
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (user) {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        userId: user._id,
        role: user.role
      };
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      data: null
    });
  }

  // Check if user is admin by role OR email containing "admin"
  const isAdmin = req.user.role === 'admin' ||
    (req.user.email && req.user.email.toLowerCase().includes('admin'));

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      data: null
    });
  }

  next();
};