import React from 'react';
import { func, instanceOf, object, oneOf, shape, string } from 'prop-types';
import moment from 'moment';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import { Field } from 'react-final-form';
import * as validators from '../../util/validators';
import { FieldDateInput, FieldSelect } from '../../components';

import css from './DateHourPicker.css';

const HOUR_FORMAT = 'hh:mm a';

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

const generateHourOptions = (date, startTime, endTime) => {
  let options = [];
  for (let i = startTime.hour; i <= endTime.hour; i++) {
    // e.g. 00:30 ... 22:30.
    const halfHour24 = `${i >= 10 ? i : `0${i}`}:30`;
    const halfHourHuman = date
      .clone()
      .add(i, 'hours')
      .add(30, 'minutes')
      .format(HOUR_FORMAT);

    const optionHalfHour = (
      <option key={halfHour24} value={halfHour24}>
        {halfHourHuman}
      </option>
    );

    // 00:00 ... 24:00. 24:00 will be converted to the next day 00:00.
    const sharpHour24 = `${i >= 10 ? i : `0${i}`}:00`;
    const sharpHourHuman = date
      .clone()
      .add(i, 'hours')
      .format(HOUR_FORMAT);

    const optionSharpHour = (
      <option key={sharpHour24} value={sharpHour24}>
        {sharpHourHuman}
      </option>
    );

    const startsOnHalfHour = i === startTime.hour && startTime.minute === 30;
    const endsOnSharpHour = i === endTime.hour && endTime.minute === 0;

    // Define order in the option array
    if (startsOnHalfHour) {
      // e.g. ['00:30']
      options.push(optionHalfHour);
    } else if (endsOnSharpHour) {
      // e.g. ['21:00']
      options.push(optionSharpHour);
    } else {
      // e.g. ['01:00', '01:30']
      options.push(optionSharpHour);
      options.push(optionHalfHour);
    }
  }
  return options;
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

const DateHourPicker = props => {
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

  const hourStartLabel = intl.formatMessage({ id: 'BookingDatesForm.hourStartLabel' });
  const hourStartPlaceholder = intl.formatMessage({ id: 'BookingDatesForm.hourStartPlaceholder' });
  const hourStartRequired = validators.required(
    intl.formatMessage({
      id: 'BookingDatesForm.hourStartRequired',
    })
  );

  const hourEndLabel = intl.formatMessage({ id: 'BookingDatesForm.hourEndLabel' });
  const hourEndPlaceholder = intl.formatMessage({ id: 'BookingDatesForm.hourEndPlaceholder' });
  const hourEndRequired = validators.required(
    intl.formatMessage({
      id: 'BookingDatesForm.hourEndRequired',
    })
  );

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

  return (
    <div className={classes}>
      {day ? (
          <Field
            id={`${id}.bookingDate`}
            name={`${id}.bookingDate`}
            type="hidden"
            component="input"
            format={null}
          />
        ) : (
          <FieldDateInput
            className={css.bookingDate}
            id={`${id}.bookingDate`}
            name={`${id}.bookingDate`}
            label={bookingDateLabel}
            placeholderText={datePlaceholderText}
            format={null}
            onBlur={onFieldBlur}
            onChange={onDateChange}
            useMobileMargins
            focused={bookingDateFocused}
            validate={validators.composeValidators(
              validators.required(requiredMessage),
              validators.bookingDateRequired(dateErrorMessage)
            )}
          />
        )}
      {day ? (
          <div className={css.bookingExtraDate}>
            <label>{bookingDateLabel}</label>
            <span>{intl.formatDate(day, dateFormatOptions)}</span>
          </div>
        ) : null}
      <div className={classNames(css.hourRow, { [css.hourRowExtraDate]: !!day })}>
        <FieldSelect
          className={css.hourEnd}
          id={`${id}.hourStart`}
          name={`${id}.hourStart`}
          label={hourStartLabel}
          validate={hourStartRequired}
          parse={(value, name) => {
            return value && value.length > 0 ? value : null;
          }}
        >
          <option value="" disabled>
            {hourStartPlaceholder}
          </option>
          {generateHourOptions(date, { hour: 0, minute: 0 }, { hour: 23, minute: 30 })}
        </FieldSelect>
        <FieldSelect
          className={css.hourEnd}
          id={`${id}.hourEnd`}
          name={`${id}.hourEnd`}
          label={hourEndLabel}
          validate={hourEndRequired}
          parse={(value, name) => {
            return value && value.length > 0 ? value : null;
          }}
        >
          <option value="" disabled>
            {hourEndPlaceholder}
          </option>
          {generateHourOptions(date, { hour: 0, minute: 30 }, { hour: 24, minute: 0 })}
        </FieldSelect>
      </div>
      {hourStart && hourEnd && errorMessage ? (
          <div className={css.error}>{errorMessage}</div>
        ) : null}
    </div>
  );
};

DateHourPicker.defaultProps = {
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

DateHourPicker.propTypes = {
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

export default DateHourPicker;


