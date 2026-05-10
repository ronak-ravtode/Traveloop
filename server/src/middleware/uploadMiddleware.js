import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
});

// Upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `traveloop/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Resize if larger
          { quality: 'auto:good' } // Optimize quality
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Create a readable stream from buffer and pipe to Cloudinary
    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

// Middleware to handle single image upload
export const uploadImage = (fieldName, folder = 'general') => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      const result = await uploadToCloudinary(req.file.buffer, folder);

      req.imageUrl = result.secure_url;
      req.imagePublicId = result.public_id;

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed',
        data: null
      });
    }
  };
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
  }
};

export default upload;