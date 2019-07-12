import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, FormattedDate } from 'react-intl';
import moment from 'moment';
import { propTypes } from '../../util/types';
import { daysBetween, dateFromAPIToLocalNoon } from '../../util/dates';

import css from './BookingBreakdown.css';

const BookingPeriod = props => {
  const { isSingleDay, startDate, endDate } = props;
  const dateFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (isSingleDay) {
    return <FormattedDate value={startDate} {...dateFormatOptions} />;
  }

  return (
    <FormattedMessage
      id="BookingBreakdown.bookingPeriod"
      values={{
        bookingStart: (
          <span className={css.nowrap}>
            <FormattedDate value={startDate} {...dateFormatOptions} />
          </span>
        ),
        bookingEnd: (
          <span className={css.nowrap}>
            <FormattedDate value={endDate} {...dateFormatOptions} />
          </span>
        ),
      }}
    />
  );
};

const LineItemBookingHours = props => {
  const { transaction, booking, unitType } = props;

  const { start: startDate, end: endDateRaw } = booking.attributes;
  const localStartDate = dateFromAPIToLocalNoon(startDate);
  const localEndDateRaw = dateFromAPIToLocalNoon(endDateRaw);

  const dayCount = daysBetween(localStartDate, localEndDateRaw);
  const isSingleDay = dayCount === 1;
  const endDay = moment(localEndDateRaw).subtract(1, 'days');

  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );

  const count = unitPurchase.quantity.toFixed();
  const unitCountMessage = (
    <FormattedHTMLMessage id="BookingBreakdown.hourCount" values={{ count }} />
  );

  return (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <BookingPeriod isSingleDay={isSingleDay} startDate={localStartDate} endDate={endDay} />
      </span>
      <span className={css.itemValue}>{unitCountMessage}</span>
    </div>
  );
};

LineItemBookingHours.propTypes = {
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking.isRequired,
};

export default LineItemBookingHours;



// WEBPACK FOOTER //
// ./src/components/BookingBreakdown/LineItemBookingHours.js
