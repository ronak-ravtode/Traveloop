export default {
  collection: 'notes',
  fields: {
    tripId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    content: { type: 'string', required: true },
    city: { type: 'string' },
    date: { type: 'date' },
    createdAt: { type: 'timestamp', default: () => new Date() },
    updatedAt: { type: 'timestamp', default: () => new Date() },
  },
};