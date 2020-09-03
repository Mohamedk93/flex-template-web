import React from 'react';
import {FormattedMessage, FormattedHTMLMessage, FormattedDate} from '../../util/reactIntl';
import moment from 'moment';
import {propTypes} from '../../util/types';
import { daysBetweenInclusive, monthsBetween } from '../../util/dates';

import css from './BookingBreakdown.css';

const BookingPeriod = props => {
  const {startDate, endDate} = props;
  const dateFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return (
    <FormattedMessage
      id="BookingBreakdown.bookingPeriodCustom"
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
        )
      }}
    />
  );
};

const LineItemBookingDays = props => {
  const { booking, currentRentalType } = props;
  const {start: startDate, end: endDate} = booking.attributes;

  let unitLabelMessage = null;
  let unitCountMessage = null;
  let count = null;
  if(currentRentalType === 'daily') {
    count = daysBetweenInclusive(startDate, endDate);
    unitLabelMessage = (
      <FormattedHTMLMessage id="BookingBreakdown.dayLabel"/>
    );
    unitCountMessage = (
      <FormattedHTMLMessage id="BookingBreakdown.dayCount" values={{count}}/>
    );
  } else if(currentRentalType === 'monthly') {
    count = monthsBetween(startDate, endDate);
    unitLabelMessage = (
      <FormattedHTMLMessage id="BookingBreakdown.monthLabel"/>
    );
    unitCountMessage = (
      <FormattedHTMLMessage id="BookingBreakdown.monthCount" values={{count}}/>
    );
  };

  return (
    <div>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          <BookingPeriod startDate={startDate} endDate={endDate}/>
        </span>
      </div>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          {unitLabelMessage}
        </span>
        <span className={css.itemValue}>
          {unitCountMessage}
        </span>
      </div>
    </div>
  );
};

LineItemBookingDays.propTypes = {
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking.isRequired,
};

export default LineItemBookingDays;

