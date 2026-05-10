export default {
  collection: 'budgetItems',
  fields: {
    tripId: { type: 'string', required: true },
    userId: { type: 'string', required: true },
    category: { type: 'string', enum: ['flights', 'accommodation', 'food', 'activities', 'transport', 'other'] },
    description: { type: 'string' },
    amount: { type: 'number', required: true },
    isPaid: { type: 'boolean', default: false },
    date: { type: 'date' },
    createdAt: { type: 'timestamp', default: () => new Date() },
  },
};