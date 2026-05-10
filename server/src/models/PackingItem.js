export default {
  collection: 'packingItems',
  fields: {
    tripId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    name: { type: 'string', required: true },
    category: { type: 'string', enum: ['documents', 'clothing', 'toiletries', 'electronics', 'accessories', 'money', 'other'] },
    packed: { type: 'boolean', default: false },
    createdAt: { type: 'timestamp', default: () => new Date() },
  },
};