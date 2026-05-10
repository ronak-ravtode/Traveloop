import express from 'express';
import firebaseAdmin from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.post('/verify', asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError('Token required', 400));
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || '',
        photoURL: decodedToken.picture || ''
      });
    }

    res.json({
      success: true,
      message: 'Token verified successfully',
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        userId: user._id,
        role: user.role
      }
    });
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
}));

router.post('/register', asyncHandler(async (req, res, next) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password required', 400));
  }

  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName
    });

    const customToken = await firebaseAdmin.auth().createCustomToken(userRecord.uid);

    await User.create({
      firebaseUid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || ''
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { uid: userRecord.uid, token: customToken }
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
}));

export default router;