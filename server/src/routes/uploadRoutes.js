import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/mockAuthMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { uploadImage, deleteImage } from '../middleware/uploadMiddleware.js';
import User from '../models/User.js';
import Trip from '../models/Trip.js';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload user profile image
router.post(
  '/profile-image',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    // Process upload
    await uploadImage('image', 'profiles')(req, res, () => {});

    if (!req.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
        data: null
      });
    }

    // Get current user
    const user = await User.findById(req.user.userId);

    // Delete old image if exists
    if (user.photoURL && user.photoURL.includes('cloudinary')) {
      const publicId = user.photoURL.split('/').slice(-2).join('/').split('.')[0];
      await deleteImage(`traveloop/profiles/${publicId}`);
    }

    // Update user photo
    user.photoURL = req.imageUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: { photoURL: user.photoURL }
    });
  })
);

// Upload trip cover image
router.post(
  '/trip-cover/:tripId',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    // Process upload
    await uploadImage('image', 'trips')(req, res, () => {});

    if (!req.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
        data: null
      });
    }

    // Find trip
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      await deleteImage(req.imagePublicId);
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
        data: null
      });
    }

    if (trip.user.toString() !== req.user.userId.toString()) {
      await deleteImage(req.imagePublicId);
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        data: null
      });
    }

    // Delete old image if exists
    if (trip.coverImage && trip.coverImage.includes('cloudinary')) {
      const publicId = trip.coverImage.split('/').slice(-2).join('/').split('.')[0];
      await deleteImage(`traveloop/trips/${publicId}`);
    }

    // Update trip cover image
    trip.coverImage = req.imageUrl;
    await trip.save();

    res.json({
      success: true,
      message: 'Trip cover image uploaded successfully',
      data: { coverImage: trip.coverImage }
    });
  })
);

// Upload city image (admin only - but we'll make it protected for now)
router.post(
  '/city/:cityId',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    // Process upload
    await uploadImage('image', 'cities')(req, res, () => {});

    if (!req.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
        data: null
      });
    }

    // Import City model here to avoid circular dependency
    const City = (await import('../models/City.js')).default;

    const city = await City.findById(req.params.cityId);

    if (!city) {
      await deleteImage(req.imagePublicId);
      return res.status(404).json({
        success: false,
        message: 'City not found',
        data: null
      });
    }

    // Delete old image if exists
    if (city.image && city.image.includes('cloudinary')) {
      const publicId = city.image.split('/').slice(-2).join('/').split('.')[0];
      await deleteImage(`traveloop/cities/${publicId}`);
    }

    // Update city image
    city.image = req.imageUrl;
    await city.save();

    res.json({
      success: true,
      message: 'City image uploaded successfully',
      data: { image: city.image }
    });
  })
);

export default router;