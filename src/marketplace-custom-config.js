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

export const workspaces = [
  {
    key: 'seats',
    label: 'Seats',
  },
  {
    key: 'office_rooms',
    label: 'Office rooms',
  },
  {
    key: 'meeting_rooms',
    label: 'Meeting rooms',
  },
];

export const rentals = [
  {
    key: 'hourly',
    label: 'Hourly',
  },
  {
    key: 'daily',
    label: 'Daily',
  },
  {
    key: 'monthly',
    label: 'Monthly',
  },
];

export const workspacesDefaultQuantity = {
  seats: 500,
  office_rooms: 100,
  meeting_rooms: 100,
}

export const workspacesDefaultName = {
  seats: "Seats",
  office_rooms: "Office rooms",
  meeting_rooms: "Meeting rooms",
}

export const categories = [
  { key: 'coworking', label: 'Coworking Space' },
  { key: 'office', label: 'Office Space' },
];

export const categoriesDefaultName = {
  coworking: "Coworking Space",
  office: "Office Space",
}

export const quickRent = {
  active: false
};

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
