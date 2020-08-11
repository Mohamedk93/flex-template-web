/**
 * Booking breakdown estimation
 *
 * Transactions have payment information that can be shown with the
 * BookingBreakdown component. However, when selecting booking
 * details, there is no transaction object present and we have to
 * estimate the breakdown of the transaction without data from the
 * API.
 *
 * If the payment process of a customized marketplace is something
 * else than simply daily or nightly bookings, the estimation will
 * most likely need some changes.
 *
 * To customize the estimation, first change the BookingDatesForm to
 * collect all booking information from the user (in addition to the
 * default date pickers), and provide that data to the
 * EstimatedBreakdownMaybe components. You can then make customization
 * within this file to create a fake transaction object that
 * calculates the breakdown information correctly according to the
 * process.
 *
 * In the future, the optimal scenario would be to use the same
 * transactions.initiateSpeculative API endpoint as the CheckoutPage
 * is using to get the breakdown information from the API, but
 * currently the API doesn't support that for logged out users, and we
 * are forced to estimate the information here.
 */
import React from 'react';
import moment from 'moment';
import Decimal from 'decimal.js';
import { types as sdkTypes } from '../../util/sdkLoader';
import { dateFromLocalToAPI, nightsBetween, daysBetweenInclusive } from '../../util/dates';
import { TRANSITION_REQUEST_PAYMENT, TX_TRANSITION_ACTOR_CUSTOMER } from '../../util/transaction';
import {
  LINE_ITEM_DAY,
  LINE_ITEM_NIGHT,
  LINE_ITEM_UNITS,
  DATE_TYPE_DATE,
  LINE_ITEM_SEATS_FEE,
  LINE_ITEM_OFFICE_ROOMS_FEE,
  LINE_ITEM_MEETING_ROOMS_FEE,
  LINE_ITEM_COUPON_DISCOUNT,
} from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit } from '../../util/currency';
import { BookingBreakdown } from '../../components';

import css from './BookingDatesForm.css';

const { Money, UUID } = sdkTypes;

const estimatedTotalPrice = (
  unitPrice,
  unitCount,
  seatsFee,
  officeRoomsFee,
  meetingRoomsFee,
  seatsQuantity,
  officeRoomsQuantity,
  meetingRoomsQuantity,
) => {

  const seatsFeePrice = seatsFee
    ? convertMoneyToNumber(seatsFee)
    : null;
  const officeRoomsFeePrice = officeRoomsFee
    ? convertMoneyToNumber(officeRoomsFee)
    : null;
  const meetingRoomsFeePrice = meetingRoomsFee
    ? convertMoneyToNumber(meetingRoomsFee)
    : null;

  const seatsQuantityCalc = seatsQuantity ? new Decimal(seatsQuantity) : 0;
  const officeRoomsQuantityCalc =officeRoomsQuantity ? new Decimal(officeRoomsQuantity) : 0;
  const meetingRoomsQuantityCalc = meetingRoomsQuantity ? new Decimal(meetingRoomsQuantity) : 0;

  let numericTotalPrice = 0;
  if(seatsFeePrice) {
    const seatsFeePriceTotal = new Decimal(seatsFeePrice).mul(seatsQuantityCalc)
    numericTotalPrice = new Decimal(numericTotalPrice)
      .plus(seatsFeePriceTotal)
      .toNumber();
  };
  if(officeRoomsFeePrice) {
    const officeRoomsFeePriceTotal = new Decimal(officeRoomsFeePrice).mul(officeRoomsQuantityCalc)
    numericTotalPrice = new Decimal(numericTotalPrice)
      .plus(officeRoomsFeePriceTotal)
      .toNumber();
  };
  if(meetingRoomsFeePrice) {
    const meetingRoomsFeePriceTotal = new Decimal(meetingRoomsFeePrice).mul(meetingRoomsQuantityCalc)
    numericTotalPrice = new Decimal(numericTotalPrice)
      .plus(meetingRoomsFeePriceTotal)
      .toNumber();
  };
  numericTotalPrice = new Decimal(numericTotalPrice).times(unitCount).toNumber();


  return new Money(
    convertUnitToSubUnit(numericTotalPrice, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );
};

// When we cannot speculatively initiate a transaction (i.e. logged
// out), we must estimate the booking breakdown. This function creates
// an estimated transaction object for that use case.
const estimatedTransaction = (
  promo,
  unitType,
  bookingStart,
  bookingEnd,
  unitPrice,
  quantity,
  seatsFee,
  officeRoomsFee,
  meetingRoomsFee,
  seatsQuantity,
  officeRoomsQuantity,
  meetingRoomsQuantity,
  currentRentalType,
) => {

  const now = new Date();
  const isNightly =  unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY ;

  const unitCount = isNightly
    ? nightsBetween(bookingStart, bookingEnd)
    : isDaily
      ? daysBetweenInclusive(bookingStart, bookingEnd)
      : quantity;

  const totalPrice = estimatedTotalPrice(
    unitPrice,
    unitCount,
    seatsFee,
    officeRoomsFee,
    meetingRoomsFee,
    seatsQuantity,
    officeRoomsQuantity,
    meetingRoomsQuantity,
  );
  let totalPriceInNumber = convertMoneyToNumber(totalPrice);
  let numericTotalDiscount = new Decimal( totalPriceInNumber * (-1 * ((promo|| {}).value || 0)/100));
  let numerictotalPriceDiscounted = new Decimal(totalPriceInNumber).plus(numericTotalDiscount).times(100);
  numericTotalDiscount = numericTotalDiscount.times(100);

  // this line is made to create a copy of the money Class without
  // creating an accumulation side effect to total price
  // totalPriceDiscounted = totalPrice;
  // totalDiscount = totalPriceDiscounted;
  let totalDiscount = new Money( numericTotalDiscount , unitPrice.currency);
  let totalPriceDiscounted = new Money(numerictotalPriceDiscounted, unitPrice.currency);
  console.log("[TANAWY IS TESTING from EstimatedBreakdownMaybe]", totalPriceDiscounted);
// if(totalDiscount && promo){
//   totalDiscount.amount = totalDiscount.amount * (-1 * (promo.value || 0)/100);

//   totalPriceDiscounted = totalPrice - totalDiscount;
// }
  

  // bookingStart: "Fri Mar 30 2018 12:00:00 GMT-1100 (SST)" aka "Fri Mar 30 2018 23:00:00 GMT+0000 (UTC)"
  // Server normalizes night/day bookings to start from 00:00 UTC aka "Thu Mar 29 2018 13:00:00 GMT-1100 (SST)"
  // The result is: local timestamp.subtract(12h).add(timezoneoffset) (in eg. -23 h)

  // local noon -> startOf('day') => 00:00 local => remove timezoneoffset => 00:00 API (UTC)
  const serverDayStart = dateFromLocalToAPI(
    moment(bookingStart)
      .startOf('day')
      .toDate()
  );
  const serverDayEnd = dateFromLocalToAPI(
    moment(bookingEnd)
      .startOf('day')
      .toDate()
  );

  const seatsFeeLineItem = {
    code: LINE_ITEM_SEATS_FEE,
    includeFor: ['customer', 'provider'],
    unitPrice: seatsFee,
    quantity: new Decimal(seatsQuantity),
    lineTotal: seatsFee,
    reversal: false,
  };

  const seatsFeeLineItemMaybe = seatsFee
    ? [seatsFeeLineItem]
    : [];

  const officeRoomsFeeLineItem = {
    code: LINE_ITEM_OFFICE_ROOMS_FEE,
    includeFor: ['customer', 'provider'],
    unitPrice: officeRoomsFee,
    quantity: new Decimal(officeRoomsQuantity),
    lineTotal: officeRoomsFee,
    reversal: false,
  };

  const officeRoomsFeeLineItemMaybe = officeRoomsFee
    ? [officeRoomsFeeLineItem]
    : [];

  const meetingRoomsFeeLineItem = {
    code: LINE_ITEM_MEETING_ROOMS_FEE,
    includeFor: ['customer', 'provider'],
    unitPrice: meetingRoomsFee,
    quantity: new Decimal(meetingRoomsQuantity),
    lineTotal: meetingRoomsFee,
    reversal: false,
  };

  const meetingRoomsFeeLineItemMaybe = meetingRoomsFee
    ? [meetingRoomsFeeLineItem]
    : [];

  const couponDiscountLineItem = {
    code: LINE_ITEM_COUPON_DISCOUNT,
    includeFor: ['customer', 'provider'],
    unitPrice: totalDiscount,
    quantity: new Decimal(-1),
    lineTotal: totalDiscount,
    reversal: false,
  };

  const couponDiscountLineItemMaybe = promo
  ? [couponDiscountLineItem]
  : [];

  return {
    id: new UUID('estimated-transaction'),
    type: 'transaction',
    attributes: {
      promo: promo,
      createdAt: now,
      lastTransitionedAt: now,
      lastTransition: TRANSITION_REQUEST_PAYMENT,
      payinTotal: totalPriceDiscounted,
      payoutTotal: totalPriceDiscounted,
      lineItems: [
        ...seatsFeeLineItemMaybe,
        ...officeRoomsFeeLineItemMaybe,
        ...meetingRoomsFeeLineItemMaybe,
        ...couponDiscountLineItemMaybe,
        {
          code: unitType,
          includeFor: ['customer', 'provider'],
          unitPrice: unitPrice,
          quantity: new Decimal(unitCount),
          lineTotal: totalPriceDiscounted,
          reversal: false,
        },
      ],
      transitions: [
        {
          createdAt: now,
          by: TX_TRANSITION_ACTOR_CUSTOMER,
          transition: TRANSITION_REQUEST_PAYMENT,
        },
      ],
    },
    booking: {
      id: new UUID('estimated-booking'),
      type: 'booking',
      attributes: {
        start: bookingStart,
        end: bookingEnd,
      },
    },
  };
};

const EstimatedBreakdownMaybe = props => {
  const {
    promo,
    unitType,
    unitPrice,
    startDate,
    endDate,
    quantity,
    seatsFee,
    officeRoomsFee,
    meetingRoomsFee,
    seatsQuantity,
    officeRoomsQuantity,
    meetingRoomsQuantity,
    currentRentalType,
    listing
  } = props.bookingData;
  const { currentUser } = props;
  const isUnits = unitType === LINE_ITEM_UNITS;
  const quantityIfUsingUnits = !isUnits || Number.isInteger(quantity);
  const canEstimatePrice = startDate && endDate && unitPrice && quantityIfUsingUnits;
  if (!canEstimatePrice) {
    return null;
  }

  const tx = estimatedTransaction(
    promo,
    unitType,
    startDate,
    endDate,
    unitPrice,
    quantity,
    seatsFee,
    officeRoomsFee,
    meetingRoomsFee,
    seatsQuantity,
    officeRoomsQuantity,
    meetingRoomsQuantity,
    currentRentalType,
  );

  return (
    <BookingBreakdown
      className={css.receipt}
      userRole="customer"
      currentUser={currentUser}
      unitType={unitType}
      transaction={tx}
      booking={tx.booking}
      dateType={DATE_TYPE_DATE}
      currentRentalType={currentRentalType}
      listing={listing}
      promo={promo}
    />
  );
};

export default EstimatedBreakdownMaybe;
