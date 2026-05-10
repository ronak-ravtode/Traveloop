import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife', 'nature', ''],
    default: '',
    index: true
  },
  duration: {
    type: Number,
    default: 1
  },
  cost: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  recommendedTime: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound indexes
activitySchema.index({ city: 1, category: 1 });
activitySchema.index({ city: 1, rating: -1 });

export default mongoose.model('Activity', activitySchema);