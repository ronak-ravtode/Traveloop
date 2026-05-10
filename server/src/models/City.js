import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  costIndex: {
    type: Number,
    default: 1
  },
  costLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  popularity: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Compound indexes
citySchema.index({ name: 1, country: 1 });
citySchema.index({ popularity: -1 });
citySchema.index({ region: 1, popularity: -1 });

export default mongoose.model('City', citySchema);