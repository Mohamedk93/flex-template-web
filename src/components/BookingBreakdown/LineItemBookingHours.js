import React from 'react';
import {FormattedMessage, FormattedHTMLMessage, FormattedDate} from 'react-intl';
import moment from 'moment';
import {propTypes} from '../../util/types';
import { daysBetween } from '../../util/dates';

import css from './BookingBreakdown.css';

const BookingPeriod = props => {
  const {isSingleDay, startDate, endDate} = props;
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
        )
      }}
    />
  );
};

const BookingTimes = props => {
  const {startDate, endDate} = props;
  return (
    <FormattedMessage
      id="BookingBreakdown.bookingTimes"
      values={{
        bookingStartTime: (
          <span className={css.nowrap}>
            {moment(startDate).format('hh:mm A')}
          </span>
        ),
        bookingEndTime: (
          <span className={css.nowrap}>
            {moment(endDate).format('hh:mm A')}
          </span>
        )
      }}
    />
  );
};

const LineItemBookingHours = props => {
  const {transaction, booking, unitType} = props;
  const {start: startDate, end: endDateRaw} = booking.attributes;

  const dayCount = daysBetween(startDate, endDateRaw);
  const isSingleDay = dayCount === 1;

  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );

  const count = unitPurchase.quantity.toFixed();
  const hoursLabelMessage = (
    <FormattedHTMLMessage id="BookingBreakdown.hourLabel"/>
  );
  const unitCountMessage = (
    <FormattedHTMLMessage id="BookingBreakdown.hourCount" values={{count}}/>
  );

  return (
    <div>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          <BookingPeriod isSingleDay={isSingleDay} startDate={startDate} endDate={endDateRaw}/>
        </span>
        <span>
          <BookingTimes startDate={startDate} endDate={endDateRaw}/>
        </span>
      </div>

      <div className={css.lineItem}>
      <span className={css.itemLabel}>
        {hoursLabelMessage}
      </span>
        <span className={css.itemValue}>{unitCountMessage}</span>
      </div>
    </div>
  );
};

LineItemBookingHours.propTypes = {
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking.isRequired,
};

export default LineItemBookingHours;

