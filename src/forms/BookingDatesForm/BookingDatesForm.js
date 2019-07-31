import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import config from '../../config';
import { Form, IconClose, PrimaryButton, InlineTextButton, FieldSelect } from '../../components';

import DateHourPicker, { getHours, isFullHours } from './DateHourPicker';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

import css from './BookingDatesForm.css';

const nextDate = date =>
  moment(date)
    .add(1, 'days')
    .toDate();

const rangeEndDate = dateHour => {
  if (!dateHour) {
    return null;
  }

  const firstDate = dateHour.firstDate;
  const hours = firstDate ? getHours(firstDate) : 0;
  const hasBookingInfo = firstDate && hours > 0;
  const hasExtraDays = dateHour && dateHour.extraDays && dateHour.extraDays.length > 0;

  return !hasBookingInfo
    ? null
    : hasExtraDays
      ? nextDate(dateHour.extraDays[dateHour.extraDays.length - 1].bookingDate.date)
      : nextDate(firstDate.bookingDate.date);
};

const countHours = dateHour => {
  if (!dateHour) {
    return 0;
  }

  const firstDayHours = dateHour.firstDate ? getHours(dateHour.firstDate) : 0;
  const firstDateHours = new Decimal(firstDayHours);
  if (firstDayHours <= 0 || !firstDateHours.isInteger()) {
    throw new Error('Hour calculation failed');
  }

  const extraDays = dateHour.extraDays ? dateHour.extraDays : [];
  const extraDayHours = extraDays.reduce((acc, d) => {
    const cumulated = new Decimal(acc).add(new Decimal(getHours(d)));

    if (!cumulated.isInteger()) {
      throw new Error('Hour calculation failed');
    }

    return cumulated.toNumber();
  }, 0);

  const extraDateHours = new Decimal(extraDayHours);

  return firstDateHours.add(extraDateHours).toNumber();
};

// check that all the dates have hourStart and hourEnd
const hoursSelected = dateHour => {
  const { hourStart, hourEnd } = dateHour && dateHour.firstDate ? dateHour.firstDate : {};
  if (!(hourStart && hourEnd)) {
    return false;
  }

  const extraDays = dateHour.extraDays || [];
  const validExtraDays = extraDays.filter(e => e.hourStart && e.hourEnd);

  return extraDays.length === validExtraDays.length;
};

// Check that
//  - all the dates have hourStart and hourEnd
//  - total number of hours is positive
//  - full hours are selected
const hoursValid = dateHour => {
  let totalHours = 0;
  try {
    totalHours = countHours(dateHour);
  } catch (e) {
    // No need to react - totalHours is just 0
  }

  return hoursSelected(dateHour) && totalHours > 0 && isFullHours(totalHours);
};

export class BookingDatesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null, bookingHoursError: false };
    this.handleFieldBlur = this.handleFieldBlur.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFieldBlur() {
    this.setState({ focusedInput: null });
  }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(values) {
    const { intl } = this.props;
    const { firstDate, extraDays = [], paymentMethod } = values;
    const bookingDate = firstDate ? firstDate.bookingDate : null;

    let totalHours = 0;
    try {
      totalHours = countHours(values);
    } catch (e) {
      // No need to react - totalHours is just 0
    }

    if (!(bookingDate && bookingDate.date)) {
      this.setState({ focusedInput: 'bookingDate' });
    } else if (!hoursSelected(values)) {
      this.setState({ bookingHoursError: true });
    } else if (totalHours > 0 && isFullHours(totalHours)) {
      const startDate = moment(bookingDate.date)
        .startOf('day')
        .toDate();

      let endDate =
        extraDays && extraDays.length > 0
          ? nextDate(extraDays[extraDays.length - 1].bookingDate.date)
          : nextDate(startDate);

      endDate = moment(endDate)
        .startOf('day')
        .toDate();

      var sdt = new Date(bookingDate.date).setHours(Number(firstDate.hourStart.split(':')[0]));
      var sdtWithMin = new Date(sdt).setMinutes(Number(firstDate.hourStart.split(':')[1]));
      var sdtFinal = new Date(sdtWithMin);

      var edt = new Date(bookingDate.date).setHours(Number(firstDate.hourEnd.split(':')[0]));
      var edtWithMin = new Date(edt).setMinutes(Number(firstDate.hourEnd.split(':')[1]));
      var edtFinal = new Date(edtWithMin);

      const formatMessageLine = dateData => {
        //be sure to convert to UTC time from local timezone!
        const date = moment(dateData.bookingDate.date)
          .utc()
          .startOf('day');

        // i.e. 'Fri, Jan 6, 01:00 pm'
        const startMoment = moment(
          `${date.format('YYYY MM DD')} ${dateData.hourStart}`,
          'YYYY MM DD HH:mm'
        );
        const dateHourStart = startMoment.format('ddd, MMM D, hh:mm a');

        // i.e. Friday 18:00 -> '06:00 pm', and Friday 24:00 -> 'Sat, Jan 7, 12:00 am'
        const endMoment = moment(
          `${date.format('YYYY MM DD')} ${dateData.hourEnd}`,
          'YYYY MM DD HH:mm'
        );
        const isEnding24Hours = dateData.hourEnd === '24:00';
        const dateHourEnd = isEnding24Hours
          ? endMoment.format('ddd, MMM D, hh:mm a')
          : endMoment.format('hh:mm a');

        return intl.formatMessage(
          { id: 'BookingDatesForm.bookingDateMessageDateHourLine' },
          { dateHourStart, dateHourEnd }
        );
      };

      const dateHourLines = extraDays.map(d => {
        return formatMessageLine(d);
      });

      this.props.onSubmit({
        paymentMethod,
        bookingDates: {
          startDate: sdtFinal,
          endDate: edtFinal,
        },
        bookingDatesWithTimes: {
          dateHourStart: sdtFinal,
          dateHourEnd: edtFinal,
        },
        hours: totalHours,
        message: [
          intl.formatMessage({ id: 'BookingDatesForm.bookingDateMessageFirstLine' }),
          formatMessageLine(firstDate),
          ...dateHourLines,
        ],
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={fieldRenderProps => {
          const {
            datePlaceholder,
            form,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitPrice,
            unitType,
            values,
          } = fieldRenderProps;
          const { firstDate, extraDays = [] } = values;
          const required = validators.required('This field is required');

          let totalHours = 0;
          try {
            totalHours = countHours(values);
          } catch (e) {
            // No need to react - totalHours is just 0
          }

          let startDate = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;
          let endDate = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;


          if(firstDate){
            var hourStart = values.firstDate.hourStart;
            var hourEnd = values.firstDate.hourEnd;

            if(hourStart){
              var hourStartHH = parseInt(hourStart.substr(0, 2));
              var hourStartMM = parseInt(hourStart.substr(3, 4));
              startDate = moment(startDate).seconds(0).milliseconds(0).minutes(hourStartMM).hours(hourStartHH).toDate()
            }

            if(hourEnd){
              var hourEndtHH = parseInt(hourEnd.substr(0, 2));
              var hourEndMM = parseInt(hourEnd.substr(3, 4));
              endDate = moment(startDate).seconds(0).milliseconds(0).minutes(hourEndMM).hours(hourEndtHH).toDate()
            }
          }

          // This is the place to collect breakdown estimation data. See the
          // EstimatedBreakdownMaybe component to change the calculations
          // for customised payment processes.
          const bookingData =
            startDate && endDate
              ? {
                unitType,
                unitPrice,
                startDate,
                endDate,

                // NOTE: If unitType is `line-item/units`, a new picker
                // for the quantity should be added to the form.
                quantity: totalHours,
              }
              : null;
          const bookingInfo =
            bookingData && hoursValid(values) ? (
                <div className={css.priceBreakdownContainer}>
                  <h3 className={css.priceBreakdownTitle}>
                    <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
                  </h3>
                  <EstimatedBreakdownMaybe bookingData={bookingData} />
                </div>
              ) : null;

          const hoursError = this.state.bookingHoursError ? (
              <span className={css.hoursError}>
              <FormattedMessage id="BookingDatesForm.hoursError" />
            </span>
            ) : null;

          const submitButtonClasses = classNames(
            css.submitButtonWrapper,
            submitButtonWrapperClassName
          );

          return (
            <Form
              onSubmit={e => {
                if (firstDate && firstDate.bookingDate) {
                  handleSubmit(e);
                } else {
                  e.preventDefault();
                  this.setState({ focusedInput: 'bookingDate' });
                }
              }}
              className={classes}
            >
              <DateHourPicker
                id="firstDate"
                name="firstDate"
                {...firstDate}
                intl={intl}
                onDateChange={v => {
                  const hasFirstDate = firstDate && firstDate.bookingDate;
                  if (hasFirstDate && firstDate.bookingDate.date.getTime() !== v.date.getTime()) {
                    form.change('extraDays', []);
                  }
                  form.change('firstDate.bookingDate', v);
                }}
                datePlaceholder={datePlaceholder}
                focusedInput={this.state.focusedInput}
                onFieldBlur={e => {
                  this.handleFieldBlur(e);
                }}
              />
              {hoursValid(values) ? (
                  <FieldSelect id="paymentMethod" name="paymentMethod" label="Choose payment method" validate={required}>
                    <option value="">Select payment</option>
                    <option value="credit card">Credit card</option>
                    <option value="cash">Cash</option>
                  </FieldSelect>
                ): null}
              <FieldArray
                name="extraDays"
                render={fieldArrayProps => {
                  const { fields } = fieldArrayProps;

                  const futureDate = (firstDay, dayCount) =>
                    moment(firstDay)
                      .add(dayCount, 'days')
                      .toDate();

                  return (
                    <ul className={css.extraDays}>
                      {extraDays.map((extraDaysId, i) => {
                        return (
                          <li key={i} className={css.extraDay}>
                            <DateHourPicker
                              id={`extraDays[${i}]`}
                              {...extraDays[i]}
                              day={futureDate(startDate, i + 1)}
                              intl={intl}
                            />
                            {i === fields.length - 1 ? (
                                <button
                                  className={css.removeLastDay}
                                  type="button"
                                  title="Remove Member"
                                  onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    //onRemoveLastDay();
                                    fields.pop();
                                  }}
                                >
                                  <IconClose />
                                </button>
                              ) : null}
                          </li>
                        );
                      })}
                      {hoursValid(values) ? (
                          <li>
                            <InlineTextButton
                              className={css.addDayButton}
                              type="button"
                              onClick={() => {
                                const daysToFuture =
                                  (fields.length && fields.length > 0 ? fields.length : 0) + 1;
                                fields.push({
                                  bookingDate: { date: futureDate(startDate, daysToFuture) },
                                });
                              }}
                            >
                              <FormattedMessage id="BookingDatesForm.addAdditionalDay" />
                            </InlineTextButton>
                          </li>
                        ) : null}
                    </ul>
                  );
                }}
              />

              {hoursError}
              {bookingInfo}
              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
};

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  datePlaceholder: string,
};

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingDatesForm.displayName = 'BookingDatesForm';

export default BookingDatesForm;


