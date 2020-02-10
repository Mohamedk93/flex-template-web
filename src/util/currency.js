import has from 'lodash/has';
import trimEnd from 'lodash/trimEnd';
import Decimal from 'decimal.js';
import { types as sdkTypes } from './sdkLoader';
import { subUnitDivisors } from '../currency-config';

const { Money } = sdkTypes;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
// https://stackoverflow.com/questions/26380364/why-is-number-max-safe-integer-9-007-199-254-740-991-and-not-9-007-199-254-740-9
export const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -1 * (2 ** 53 - 1);
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 2 ** 53 - 1;

export const isSafeNumber = decimalValue => {
  if (!(decimalValue instanceof Decimal)) {
    throw new Error('Value must be a Decimal');
  }
  return decimalValue.gte(MIN_SAFE_INTEGER) && decimalValue.lte(MAX_SAFE_INTEGER);
};

// Get the minor unit divisor for the given currency
export const unitDivisor = currency => {
  if (!has(subUnitDivisors, currency)) {
    throw new Error(`No minor unit divisor defined for currency: ${currency}`);
  }
  return subUnitDivisors[currency];
};

////////// Currency manipulation in string format //////////

/**
 * Ensures that the given string uses only dots or commas
 * e.g. ensureSeparator('9999999,99', false) // => '9999999.99'
 *
 * @param {String} str - string to be formatted
 *
 * @return {String} converted string
 */
export const ensureSeparator = (str, useComma = false) => {
  if (typeof str !== 'string') {
    throw new TypeError('Parameter must be a string');
  }
  return useComma ? str.replace(/\./g, ',') : str.replace(/,/g, '.');
};

/**
 * Ensures that the given string uses only dots
 * (e.g. JavaScript floats use dots)
 *
 * @param {String} str - string to be formatted
 *
 * @return {String} converted string
 */
export const ensureDotSeparator = str => {
  return ensureSeparator(str, false);
};

/**
 * Convert string to Decimal object (from Decimal.js math library)
 * Handles both dots and commas as decimal separators
 *
 * @param {String} str - string to be converted
 *
 * @return {Decimal} numeral value
 */
export const convertToDecimal = str => {
  const dotFormattedStr = ensureDotSeparator(str);
  return new Decimal(dotFormattedStr);
};

/**
 * Converts Decimal value to a string (from Decimal.js math library)
 *
 * @param {Decimal|Number|String} decimalValue
 *
 * @param {boolean} useComma - optional.
 * Specify if return value should use comma as separator
 *
 * @return {String} converted value
 */
export const convertDecimalToString = (decimalValue, useComma = false) => {
  const d = new Decimal(decimalValue);
  return ensureSeparator(d.toString(), useComma);
};

// Divisor can be positive value given as Decimal, Number, or String
const convertDivisorToDecimal = divisor => {
  try {
    const divisorAsDecimal = new Decimal(divisor);
    if (divisorAsDecimal.isNegative()) {
      throw new Error(`Parameter (${divisor}) must be a positive number.`);
    }
    return divisorAsDecimal;
  } catch (e) {
    throw new Error(`Parameter (${divisor}) must present a number.`, e);
  }
};

/**
 * Limits value to sub-unit precision: "1.4567" -> "1.45"
 * Useful in input fields so this doesn't use rounding.
 *
 * @param {String} inputString - positive number presentation.
 *
 * @param {Decimal|Number|String} subUnitDivisor - should be something that can be converted to
 * Decimal. (This is a ratio between currency's main unit and sub units.)
 *
 * @param {boolean} useComma - optional.
 * Specify if return value should use comma as separator
 *
 * @return {String} truncated value
 */
export const truncateToSubUnitPrecision = (inputString, subUnitDivisor, useComma = false) => {
  const subUnitDivisorAsDecimal = convertDivisorToDecimal(subUnitDivisor);

  // '10,' should be passed through, but that format is not supported as valid number
  const trimmed = trimEnd(inputString, useComma ? ',' : '.');
  // create another instance and check if value is convertable
  const value = convertToDecimal(trimmed, useComma);

  if (value.isNegative()) {
    throw new Error(`Parameter (${inputString}) must be a positive number.`);
  }

  // Amount is always counted in subunits
  // E.g. $10 => 1000¢
  const amount = value.times(subUnitDivisorAsDecimal);

  if (!isSafeNumber(amount)) {
    throw new Error(
      `Cannot represent money minor unit value ${amount.toString()} safely as a number`
    );
  }

  // Amount must be integer
  // We don't deal with subunit fragments like 1000.345¢
  if (amount.isInteger()) {
    // accepted strings: '9', '9,' '9.' '9,99'
    const decimalCount2 = value.toFixed(3);
    const decimalPrecisionMax2 =
      decimalCount2.length >= inputString.length ? inputString : value.toFixed(5);
    return ensureSeparator(decimalPrecisionMax2, useComma);
  } else {
    // truncate strings ('9.999' => '9.99')
    const truncated = amount.truncated().dividedBy(subUnitDivisorAsDecimal);
    return convertDecimalToString(truncated, useComma);
  }
};

////////// Currency - Money helpers //////////

/**
 * Converts given value to sub unit value and returns it as a number
 *
 * @param {Number|String} value
 *
 * @param {Decimal|Number|String} subUnitDivisor - should be something that can be converted to
 * Decimal. (This is a ratio between currency's main unit and sub units.)
 *
 * @param {boolean} useComma - optional.
 * Specify if return value should use comma as separator
 *
 * @return {number} converted value
 */
const f = value => ( (value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (0) );

 export const convertUnitToSubUnit = (value, subUnitDivisor, useComma = false, fixed = true) => {
  const subUnitDivisorAsDecimal = convertDivisorToDecimal(subUnitDivisor);
  if(f(value) !== 2 && fixed){
    value = value.toFixed(2);
  }
  if (!(typeof value === 'string' || typeof value === 'number')) {
    throw new TypeError('Value must be either number or string');
  }

  const val = typeof value === 'string' ? convertToDecimal(value, useComma) : new Decimal(value);
  const amount = val.times(subUnitDivisorAsDecimal);

  if (!isSafeNumber(amount)) {
    throw new Error(
      `Cannot represent money minor unit value ${amount.toString()} safely as a number`
    );
  } else if (amount.isInteger()) {
    return amount.toNumber();
  } else {
    throw new Error(`value must divisible by ${subUnitDivisor}`);
  }
};

const isNumber = value => {
  return typeof value === 'number' && !isNaN(value);
};

/* eslint-disable no-underscore-dangle */
// Detect if the given value is a goog.math.Long object
// See: https://google.github.io/closure-library/api/goog.math.Long.html
const isGoogleMathLong = value => {
  return typeof value === 'object' && isNumber(value.low_) && isNumber(value.high_);
};
/* eslint-enable no-underscore-dangle */

/**
 * Convert Money to a number
 *
 * @param {Money} value
 *
 * @return {Number} converted value
 */
export const convertMoneyToNumber = value => {
  if (!(value instanceof Money)) {
    throw new Error('Value must be a Money type');
  }
  const subUnitDivisorAsDecimal = convertDivisorToDecimal(unitDivisor(value.currency));
  let amount;

  if (isGoogleMathLong(value.amount)) {
    // TODO: temporarily also handle goog.math.Long values created by
    // the Transit tooling in the Sharetribe JS SDK. This should be
    // removed when the value.amount will be a proper Decimal type.

    // eslint-disable-next-line no-console
    console.warn('goog.math.Long value in money amount:', value.amount, value.amount.toString());

    amount = new Decimal(value.amount.toString());
  } else {
    amount = new Decimal(value.amount);
  }

  if (!isSafeNumber(amount)) {
    throw new Error(
      `Cannot represent money minor unit value ${amount.toString()} safely as a number`
    );
  }

  return amount.dividedBy(subUnitDivisorAsDecimal).toNumber();
};

/**
 * Format the given money to a string
 *
 * @param {Object} intl
 * @param {Money} value
 *
 * @return {String} formatted money value
 */
export const formatMoney = (intl, value) => {
  if (!(value instanceof Money)) {
    throw new Error('Value must be a Money type');
  }
  const valueAsNumber = convertMoneyToNumber(value);

  // See: https://github.com/yahoo/react-intl/wiki/API#formatnumber
  const numberFormatOptions = {
    style: 'currency',
    currency: value.currency,
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  };

  return intl.formatNumber(valueAsNumber, numberFormatOptions);
};

/**
 * Format the given major-unit string value as currency. E.g. "10" -> "$10".
 *
 * NOTE: This function should not be used with listing prices or other Money type.
 * This can be used with price filters and other components that doesn't send Money types to API.
 *
 * @param {Object} intl
 * @param {String} value
 *
 * @return {String} formatted money value
 */
export const formatCurrencyMajorUnit = (intl, currency, valueWithoutSubunits) => {
  const valueAsNumber = new Decimal(valueWithoutSubunits).toNumber();

  // See: https://github.com/yahoo/react-intl/wiki/API#formatnumber
  const numberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  return intl.formatNumber(valueAsNumber, numberFormatOptions);
};


Array.min = function( array ){
  return Math.min.apply( Math, array );
};


export const listingMinPrice = (listing) => {
  if(!listing){ return null;}
  
  try{
    const publicData = listing.attributes.publicData;

    const price_seats_hourly = publicData && publicData.priceSeatsHourly && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsHourly.amount, publicData.priceSeatsHourly.currency) : null;
    const price_seats_daily = publicData && publicData.priceSeatsDaily && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsDaily.amount, publicData.priceSeatsDaily.currency) : null;
    const price_seats_monthly = publicData && publicData.priceSeatsMonthly && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsMonthly.amount, publicData.priceSeatsMonthly.currency) : null;
  
    const price_office_rooms_hourly = publicData && publicData.priceOfficeRoomsHourly && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsHourly.amount, publicData.priceOfficeRoomsHourly.currency) : null;
    const price_office_rooms_daily = publicData && publicData.priceOfficeRoomsDaily && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsDaily.amount, publicData.priceOfficeRoomsDaily.currency) : null;
    const price_office_rooms_monthly = publicData && publicData.priceOfficeRoomsMonthly && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsMonthly.amount, publicData.priceOfficeRoomsMonthly.currency) : null;
  
    const price_meeting_rooms_hourly = publicData && publicData.priceMeetingRoomsHourly && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsHourly.amount, publicData.priceMeetingRoomsHourly.currency) : null;
    const price_meeting_rooms_daily = publicData && publicData.priceMeetingRoomsDaily && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsDaily.amount, publicData.priceMeetingRoomsDaily.currency) : null;
    const price_meeting_rooms_monthly = publicData && publicData.priceMeetingRoomsMonthly && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsMonthly.amount, publicData.priceMeetingRoomsMonthly.currency) : null;
    
    const priceArrayFiltered = [
      price_seats_hourly,
      price_seats_daily,
      price_seats_monthly,
      price_office_rooms_hourly,
      price_office_rooms_daily,
      price_office_rooms_monthly,
      price_meeting_rooms_hourly,
      price_meeting_rooms_daily,
      price_meeting_rooms_monthly,
    ].filter(function(x) {
      return x !== undefined && x !== null && x.amount && x.amount > 0
    });

    const priceArray = priceArrayFiltered.map(function(x) {
      return x.amount
    });
    const minimalPrice = Array.min(priceArray);
    return minimalPrice;

  }catch (e) {
    console.log(e);
    return listing.attributes.price.amount;
  }
}


export const convertPrice = (currentUser, oldPriceAmount, defaultPrice) => {
  let currency = null;
  let rates = [];
  let result = null;
  let oldPrice = oldPriceAmount / 100;
  if(currentUser && currentUser.attributes.profile.protectedData.currency){
    currency = currentUser.attributes.profile.protectedData.currency;
    rates = currentUser.attributes.profile.protectedData.rates;
    result = rates.find(e => e.iso_code == currency);
  }else if(typeof window !== 'undefined'){
    rates = JSON.parse(localStorage.getItem('rates'));
    currency = localStorage.getItem('currentCode');
    result = !rates ? null : rates.find(e => e.iso_code == currency);
  }
  if(result){
    oldPrice = oldPrice * result.current_rate
    oldPrice = oldPrice.toFixed(2);
    oldPrice = result.symbol.toString() + oldPrice;
    return oldPrice;
  }
  return defaultPrice;
}

export const converter = (item, currentUser) => {
  if(currentUser && item){
    let currency = null;
    let rates = [];
    if(currentUser.attributes.profile.protectedData.currency){
      currency = currentUser.attributes.profile.protectedData.currency;
      rates = currentUser.attributes.profile.protectedData.rates;
      const result = rates.find(e => e.iso_code == currency);
      if(result){
        item = item.substr(1).replace(/,/g, '');
        item = item * result.current_rate
        item = item.toFixed(2);
        item = result.symbol.toString() + item;
        return item
      }
    }
  }else {
    return item
  }
}

export const getValueToMobile = (name, defaultValue) => {
  const amount = localStorage.getItem(name);
  if(amount){
    return amount;
  }else{
    return defaultValue.amount; 
  } 
}

export const getMinPrice = (array) => {
  array = array.filter(function(x) {
    return x !== undefined && x !== null && x.amount && x.amount > 0
  });
  const priceArray = array.map(function(x) {
    return x.amount
  });
  const minAmount = Array.min(priceArray);
  return minAmount;
};


export const listingAvailablePricesMeta = [
  {
    type: 'priceSeatsHourly',
    unit: 'ListingCard.perHour',
    rentalType: 'hourly'
  },
  {
    type: 'priceSeatsDaily',
    unit: 'ListingCard.perDay',
    rentalType: 'daily'
  },
  {
    type: 'priceSeatsMonthly',
    unit: 'ListingCard.perMonth',
    rentalType: 'monthly'
  },
  {
    type: 'priceOfficeRoomsHourly',
    unit: 'ListingCard.perHour',
    rentalType: 'hourly'
  },
  {
    type: 'priceOfficeRoomsDaily',
    unit: 'ListingCard.perDay',
    rentalType: 'daily'
  },
  {
    type: 'priceOfficeRoomsMonthly',
    unit: 'ListingCard.perMonth',
    rentalType: 'monthly'
  },
  {
    type: 'priceMeetingRoomsHourly',
    unit: 'ListingCard.perHour',
    rentalType: 'hourly'
  },
  {
    type: 'priceMeetingRoomsDaily',
    unit: 'ListingCard.perDay',
    rentalType: 'daily'
  },
  {
    type: 'priceMeetingRoomsMonthly',
    unit: 'ListingCard.perMonth',
    rentalType: 'monthly'
  },
];


export const listingCalculateMinPrice = (pubData) => {
  let min_price_meta = listingAvailablePricesMeta.filter((priceItem) => {
    
    if (!pubData[priceItem.type] || !pubData.rentalTypes) {
      return false;
    }

    if (pubData.rentalTypes.indexOf(priceItem.rentalType) !== -1 && 
      Number(pubData[priceItem.type].amount) > 0) {
      return true
    } else {
      return false
    }
  }).sort((a, b) => {
    let a_val = Number(pubData[a.type] && pubData[a.type].amount);
    let b_val = Number(pubData[b.type] && pubData[b.type].amount);

    if (a_val === b_val) {
      return 0;
    } else if (a_val > b_val) {
      return 1;
    } else {
      return -1;
    }
  })[0];

  return min_price_meta && {
    price: pubData[min_price_meta.type],
    meta: min_price_meta
  }
};