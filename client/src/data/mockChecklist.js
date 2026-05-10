export const packingCategories = {
  documents: {
    label: 'Documents',
    icon: 'file-text',
    items: [
      { id: 'd1', name: 'Passport', essential: true },
      { id: 'd2', name: 'Visa', essential: true },
      { id: 'd3', name: 'Travel insurance documents', essential: true },
      { id: 'd4', name: 'Flight tickets', essential: true },
      { id: 'd5', name: 'Hotel reservations', essential: false },
      { id: 'd6', name: 'ID card', essential: false },
      { id: 'd7', name: 'Driver\'s license', essential: false },
      { id: 'd8', name: 'Credit/debit cards', essential: true },
      { id: 'd9', name: 'Emergency contacts list', essential: false },
      { id: 'd10', name: 'Copies of important documents', essential: false },
    ]
  },
  clothing: {
    label: 'Clothing',
    icon: 'shirt',
    items: [
      { id: 'c1', name: 'T-shirts', essential: true },
      { id: 'c2', name: 'Pants/shorts', essential: true },
      { id: 'c3', name: 'Underwear', essential: true },
      { id: 'c4', name: 'Socks', essential: true },
      { id: 'c5', name: 'Pajamas', essential: false },
      { id: 'c6', name: 'Light jacket/sweater', essential: false },
      { id: 'c7', name: 'Rain jacket', essential: false },
      { id: 'c8', name: 'Swimwear', essential: false },
      { id: 'c9', name: 'Comfortable walking shoes', essential: true },
      { id: 'c10', name: 'Sandals/slippers', essential: false },
      { id: 'c11', name: 'Hat/cap', essential: false },
      { id: 'c12', name: 'Dressy outfit', essential: false },
    ]
  },
  toiletries: {
    label: 'Toiletries',
    icon: 'droplets',
    items: [
      { id: 't1', name: 'Toothbrush', essential: true },
      { id: 't2', name: 'Toothpaste', essential: true },
      { id: 't3', name: 'Shampoo', essential: false },
      { id: 't4', name: 'Conditioner', essential: false },
      { id: 't5', name: 'Body wash/soap', essential: false },
      { id: 't6', name: 'Deodorant', essential: false },
      { id: 't7', name: 'Sunscreen', essential: true },
      { id: 't8', name: 'Lip balm with SPF', essential: false },
      { id: 't9', name: 'Insect repellent', essential: false },
      { id: 't10', name: 'Personal medications', essential: true },
      { id: 't11', name: 'First aid kit', essential: false },
      { id: 't12', name: 'Hand sanitizer', essential: false },
      { id: 't13', name: 'Wet wipes', essential: false },
    ]
  },
  electronics: {
    label: 'Electronics',
    icon: 'smartphone',
    items: [
      { id: 'e1', name: 'Phone', essential: true },
      { id: 'e2', name: 'Charger', essential: true },
      { id: 'e3', name: 'Power bank', essential: false },
      { id: 'e4', name: 'Travel adapter', essential: true },
      { id: 'e5', name: 'Camera', essential: false },
      { id: 'e6', name: 'Memory cards', essential: false },
      { id: 'e7', name: 'Earphones/headphones', essential: false },
      { id: 'e8', name: 'Laptop/tablet', essential: false },
      { id: 'e9', name: 'Portable WiFi/E-SIM', essential: false },
    ]
  },
  accessories: {
    label: 'Accessories',
    icon: 'watch',
    items: [
      { id: 'a1', name: 'Sunglasses', essential: true },
      { id: 'a2', name: 'Watch', essential: false },
      { id: 'a3', name: 'Jewelry', essential: false },
      { id: 'a4', name: 'Belt', essential: false },
      { id: 'a5', name: 'Wallet', essential: true },
      { id: 'a6', name: 'Day bag/backpack', essential: false },
      { id: 'a7', name: 'Travel pillow', essential: false },
      { id: 'a8', name: 'Eye mask', essential: false },
      { id: 'a9', name: 'Earplugs', essential: false },
    ]
  },
  money: {
    label: 'Money',
    icon: 'banknote',
    items: [
      { id: 'm1', name: 'Local currency', essential: false },
      { id: 'm2', name: 'USD/Euros for exchange', essential: false },
      { id: 'm3', name: 'Credit cards', essential: true },
      { id: 'm4', name: 'Travel cards', essential: false },
    ]
  }
};

export const getCategoryItems = (category) => packingCategories[category]?.items || [];
export const getAllItems = () => Object.values(packingCategories).flatMap(cat => cat.items);
export const getEssentialItems = () => getAllItems().filter(item => item.essential);
export const getItemsByEssentials = (essential) => getAllItems().filter(item => item.essential === essential);

export const createPackingList = (tripId, userPreferences = {}) => {
  const items = getAllItems().map(item => ({
    id: `${tripId}-${item.id}`,
    name: item.name,
    packed: false,
    category: Object.keys(packingCategories).find(cat =>
      packingCategories[cat].items.some(i => i.id === item.id)
    ),
    essential: item.essential
  }));
  return items;
};