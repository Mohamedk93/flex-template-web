/*
 * Marketplace specific configuration.
 */

export const amenities = [
  {
    key: 'wifi',
    label: 'WiFi',
  },
  {
    key: 'projector',
    label: 'Projector',
  },
  {
    key: 'printer',
    label: 'Printer',
  },
  {
    key: 'writing_board',
    label: 'Writing board',
  },
  {
    key: 'coffee',
    label: 'Coffee',
  },
  {
    key: 'pantry',
    label: 'Pantry',
  },
];

export const categories = [
  { key: 'meeting_room', label: 'Meeting room' },
  { key: 'seat', label: 'Seat' },
];

export const weekDays = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

// Price filter configuration
// Note: unlike most prices this is not handled in subunits
export const priceFilterConfig = {
  min: 5,
  max: 1000,
  step: 5,
};

// Activate booking dates filter on search page
export const dateRangeFilterConfig = {
  active: true,
};

// Activate keyword filter on search page

// NOTE: If you are ordering search results by distance the keyword search can't be used at the same time.
// You can turn off ordering by distance in config.js file
export const keywordFilterConfig = {
  active: true,
};
