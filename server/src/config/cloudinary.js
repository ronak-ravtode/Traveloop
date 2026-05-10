import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'de82fgovr',
  api_key: process.env.CLOUDINARY_API_KEY || '493838587288488',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FGoggbAhk46F7rXXm8CqJdv-Pbc'
});

export default cloudinary;