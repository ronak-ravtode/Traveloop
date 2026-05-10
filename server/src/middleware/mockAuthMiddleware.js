import User from '../models/User.js';

/**
 * Mock Authentication Middleware for Hackathon/Demo
 *
 * IMPORTANT: This is a simplified auth for demo purposes only.
 * Production should use Firebase Admin SDK with proper token verification.
 *
 * This middleware reads user info from custom headers sent by frontend:
 * - x-user-uid: Firebase UID from frontend
 * - x-user-email: User email from frontend
 * - x-user-name: User display name from frontend
 *
 * It then finds or creates the user in MongoDB based on firebaseUid.
 */

// Main authentication middleware - finds or creates user based on header info
export const authenticate = async (req, res, next) => {
  try {
    // Get user info from custom headers (sent by frontend)
    const uid = req.headers['x-user-uid'];
    const email = req.headers['x-user-email'];
    const name = req.headers['x-user-name'];

    // Validate required headers
    if (!uid || !email) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
        data: null
      });
    }

    // Find user by firebaseUid or create new one
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Auto-create user on first login
      user = await User.create({
        firebaseUid: uid,
        email: email,
        name: name || email.split('@')[0],
        photoURL: req.headers['x-user-photo'] || '',
        role: 'user'
      });
      console.log(`[AUTH] New user created: ${email} (${uid})`);
    } else {
      // Update name/photo if changed
      if (name || req.headers['x-user-photo']) {
        user.name = name || user.name;
        user.photoURL = req.headers['x-user-photo'] || user.photoURL;
        await user.save();
      }
    }

    // Attach user to request
    req.user = {
      uid: uid,
      email: email,
      userId: user._id,
      role: user.role,
      name: user.name,
      photoURL: user.photoURL
    };

    next();
  } catch (error) {
    console.error('[AUTH] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      data: null
    });
  }
};

// Optional auth - continues even if no auth (for public routes)
export const optionalAuth = async (req, res, next) => {
  try {
    const uid = req.headers['x-user-uid'];
    const email = req.headers['x-user-email'];

    if (!uid || !email) {
      // No auth info, continue without user
      return next();
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (user) {
      req.user = {
        uid: uid,
        email: email,
        userId: user._id,
        role: user.role,
        name: user.name,
        photoURL: user.photoURL
      };
    }

    next();
  } catch (error) {
    // Continue without user on error
    next();
  }
};

// Admin access check
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required. Please log in.',
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

export default { authenticate, optionalAuth, requireAdmin };