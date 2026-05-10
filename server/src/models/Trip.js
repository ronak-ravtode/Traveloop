import mongoose from 'mongoose';

const activityInStopSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  title: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: '10:00'
  },
  duration: {
    type: Number,
    default: 1
  },
  cost: {
    type: Number,
    default: 0
  }
});

const stopSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  cityName: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  arrivalDate: {
    type: String,
    default: ''
  },
  departureDate: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  activities: [activityInStopSchema]
});

const checklistItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'other'
  },
  packed: {
    type: Boolean,
    default: false
  }
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  relatedCity: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  }
});

const budgetSchema = new mongoose.Schema({
  transport: {
    type: Number,
    default: 0
  },
  stay: {
    type: Number,
    default: 0
  },
  activities: {
    type: Number,
    default: 0
  },
  meals: {
    type: Number,
    default: 0
  },
  miscellaneous: {
    type: Number,
    default: 0
  }
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
    index: true
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  publicId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  budgetLimit: {
    type: Number,
    default: 0
  },
  stops: {
    type: [stopSchema],
    default: []
  },
  budget: {
    type: budgetSchema,
    default: () => ({})
  },
  checklist: {
    type: [checklistItemSchema],
    default: []
  },
  notes: {
    type: [noteSchema],
    default: []
  }
}, {
  timestamps: true
});

// Compound indexes
tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ visibility: 1, status: 1 });

export default mongoose.model('Trip', tripSchema);