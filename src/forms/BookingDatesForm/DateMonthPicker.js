import React from 'react';
import { func, instanceOf, object, oneOf, shape, string } from 'prop-types';
import moment from 'moment';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import { Field } from 'react-final-form';
import * as validators from '../../util/validators';
import { FieldDateInput, FieldSelect, FieldQuantityInput } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';

import { required, bookingDatesRequired, composeValidators } from '../../util/validators';

import css from './DateMonthPicker.css';

const identity = v => v;

export const getHours = dateHour => {
  const { bookingDate, hourStart, hourEnd } = dateHour || {};

  if (!(bookingDate && bookingDate.date && hourStart && hourEnd)) {
    return 0;
  }

  const date = moment(bookingDate.date).startOf('day');
  const startMoment = moment(`${date.format('YYYY MM DD')} ${hourStart}`, 'YYYY MM DD HH:mm');
  const endMoment = moment(`${date.format('YYYY MM DD')} ${hourEnd}`, 'YYYY MM DD HH:mm');

  const duration = moment.duration(endMoment.diff(startMoment));

  return duration.asHours();
};

export const isFullHours = duration => {
  try {
    const durationDecimal = new Decimal(duration);
    return durationDecimal.isInteger() && !durationDecimal.isZero();
  } catch (e) {
    return false;
  }
};

const isPositiveDuration = duration => {
  try {
    const durationDecimal = new Decimal(duration);
    return durationDecimal.isPositive();
  } catch (e) {
    return false;
  }
};

const DateMonthPicker = props => {
  const {
    className,
    rootClassName,
    id,
    bookingDate,
    hourStart,
    hourEnd,
    day,
    intl,
    onDateChange,
    datePlaceholder,
    focusedInput,
    onFieldBlur,
    values,
  } = props;

  const bookingDateLabel = intl.formatMessage({ id: 'BookingDatesForm.bookingDateLabel' });
  const requiredMessage = intl.formatMessage({ id: 'BookingDatesForm.requiredDate' });
  const dateErrorMessage = intl.formatMessage({
    id: 'FieldDateInput.invalidDate',
  });

  const dateFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  const now = moment();
  const today = now.startOf('day').toDate();
  const datePlaceholderText = datePlaceholder || intl.formatDate(today, dateFormatOptions);



  const classes = classNames(rootClassName || css.root, className);
  const date =
    bookingDate && bookingDate.date
      ? moment(bookingDate.date).startOf('day')
      : moment().startOf('day');

  const hours = getHours({ bookingDate, hourStart, hourEnd });
  const errorMessage =
    bookingDate && !isPositiveDuration(hours)
      ? 'You need to select valid duration'
      : bookingDate && !isFullHours(hours)
        ? 'Duration needs to be full hours'
        : null;

  const bookingDateFocused = focusedInput === 'bookingDate';

  const { monthCount } = values;
  const startDate = values.firstDate ? moment(values.firstDate.bookingDate.date) : null;
  const endDate = startDate ? moment(startDate).add(monthCount, 'M').subtract(1,'d').format('ddd, MMM D') : 'End Date';

  return (
    <div className={classes}>
      <div className={css.monthChooseHead}>
        <div className={css.label}>
          <FormattedMessage id="BookingDatesForm.bookingStartTitle" />
        </div>
        <div className={css.label}>
          <FormattedMessage id="BookingDatesForm.mounthCount" />
        </div>
        <div className={css.label}>
          <FormattedMessage id="BookingDatesForm.bookingEndTitle"  />
        </div>
      </div>
      <div className={css.monthChooseBody}>
        <FieldDateInput
          className={css.startDateField}
          id={`${id}.bookingDate`}
          name={`${id}.bookingDate`}
          label={''}
          placeholderText={datePlaceholderText}
          format={identity}
          onBlur={onFieldBlur}
          onChange={onDateChange}
          useMobileMargins
          focused={bookingDateFocused}
          validate={validators.composeValidators(
            validators.required(requiredMessage),
            validators.bookingDateRequired(dateErrorMessage)
          )}
        />
        <FieldQuantityInput
          id={'monthCount'}
          type="number"
          name={'monthCount'}
          className={css.monthCount}
        />
        <span className={css.endDateField}>
          {endDate}
        </span>
      </div>
    </div>
  );
};

DateMonthPicker.defaultProps = {
  rootClassName: null,
  className: null,
  datePlaceholder: null,
  bookingDate: null,
  hourStart: null,
  hourEnd: null,
  day: null,
  onDateChange: null,
  onHourChange: null,
  focusedInput: null,
  onFieldBlur: null,
};

DateMonthPicker.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  datePlaceholder: string,
  bookingDate: shape({
    date: instanceOf(Date),
  }),
  hourStart: string,
  hourEnd: string,
  day: instanceOf(Date),
  onDateChange: func,
  onHourChange: func,
  focusedInput: oneOf(['bookingDate']),
  onFieldBlur: func,

  // from injectIntl (BookingDatesForm.js handle)
  intl: object.isRequired,
};

export default DateMonthPicker;


