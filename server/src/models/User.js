import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  language: {
    type: String,
    default: 'English'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  travelStyle: {
    type: String,
    enum: ['Budget', 'Comfort', 'Luxury'],
    default: 'Budget'
  },
  savedDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  publicProfile: {
    type: Boolean,
    default: false
  },
  allowTripSharing: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);