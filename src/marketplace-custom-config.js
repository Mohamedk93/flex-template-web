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
    label: 'Hotdesks',
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
};

export const workspacesDefaultName = {
  seats: "Seats",
  office_rooms: "Office rooms",
  meeting_rooms: "Meeting rooms",
};

export const categories = [
  { key: 'coworking', label: 'Coworking Space' },
  { key: 'office', label: 'Office Space' },
];

export const categoriesDefaultName = {
  coworking: "Coworking Space",
  office: "Office Space",
};

export const quickRent = {
  active: false
};

export const rates = [
                     {name: 'Austaralian dollar',    iso_code: 'AUD', symbol: '$'},
                     {name: 'Algerian Dinar',        iso_code: 'DZD', symbol: 'دج'},
                     {name: 'Bahraini Dinar',        iso_code: 'BHD', symbol: '.د.ب'},
                     {name: 'Canadian Dollar',       iso_code: 'CAD', symbol: '$'},
                     {name: 'Emirati Dirham',        iso_code: 'AED', symbol: 'د.إ'},
                     {name: 'Egyptian Pound',        iso_code: 'EGP', symbol: 'ج.م'},
                     {name: 'Euro',                  iso_code: 'EUR', symbol: '€'},
                     {name: 'Indian Rupee',          iso_code: 'INR', symbol: '₹'},
                     {name: 'Jordanian Dinar',       iso_code: 'JOD', symbol: 'JD'},
                     {name: 'Kenyan Shilling',       iso_code: 'KES', symbol: '$'},
                     {name: 'Kuwaiti Dinar',         iso_code: 'KWD', symbol: 'K.D.'},
                     {name: 'Moroccan Dirham',       iso_code: 'MAD', symbol: 'د.م.'},
                     {name: 'New Zealand Dollar',    iso_code: 'NZD', symbol: '$'},
                     {name: 'Nigerian Naira',        iso_code: 'NGN', symbol: '₦'},
                     {name: 'Norweigan Krone',       iso_code: 'NOK', symbol: 'NKr'},
                     {name: 'Omani Rial',            iso_code: 'OMR', symbol: 'ر.ع.'},
                     {name: 'Pound Sterling',        iso_code: 'GBP', symbol: '£'},
                     {name: 'Pakistani Rupee',       iso_code: 'PKR', symbol: '₨'},
                     {name: 'Qatari Riyal',          iso_code: 'QAR', symbol: ' ر.ق'},
                     {name: 'Saudi Riyal',           iso_code: 'SAR', symbol: 'ر.س'},
                     {name: 'South African Rand',    iso_code: 'ZAR', symbol: 'R'},
                     {name: 'Swedish Krona',         iso_code: 'SEK', symbol: 'kr'},
                     {name: 'Swiss Franc',           iso_code: 'CHF', symbol: 'CHF'},
                     {name: 'Turkish Lira',          iso_code: 'TRY', symbol: '₺'},
                     {name: 'Tunisian Dinar',        iso_code: 'TND', symbol: 'DT'},
                     {name: 'United States Dollars', iso_code: 'USD', symbol: '$'}
                    ];

export const currencies = [
  { key: 'aud', label: 'AUD' },
  { key: 'dzd', label: 'DZD' },
  { key: 'bhd', label: 'BHD' },
  { key: 'cad', label: 'CAD' },
  { key: 'aed', label: 'AED' },
  { key: 'egp', label: 'EGP' },
  { key: 'eur', label: 'EUR' },
  { key: 'inr', label: 'INR' },
  { key: 'jod', label: 'JOD' },
  { key: 'kes', label: 'KES' },
  { key: 'kwd', label: 'KWD' },
  { key: 'mad', label: 'MAD' },
  { key: 'nzd', label: 'NZD' },
  { key: 'ngn', label: 'NGN' },
  { key: 'nok', label: 'NOK' },
  { key: 'omr', label: 'OMR' },
  { key: 'gbp', label: 'GBP' },
  { key: 'pkr', label: 'PKR' },
  { key: 'qar', label: 'QAR' },
  { key: 'sar', label: 'SAR' },
  { key: 'zar', label: 'ZAR' },
  { key: 'sek', label: 'SEK' },
  { key: 'chf', label: 'CHF' },
  { key: 'try', label: 'TRY' },
  { key: 'tnd', label: 'TND' },
  { key: 'usd', label: 'USD' },
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
