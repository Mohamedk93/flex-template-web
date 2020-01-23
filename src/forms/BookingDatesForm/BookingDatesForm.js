import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import moment from 'moment';
import Decimal from 'decimal.js';
import { propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import config from '../../config';
import { required, bookingDatesRequired, composeValidators } from '../../util/validators';
import { 
  Form, 
  IconClose, 
  PrimaryButton, 
  InlineTextButton,
  FieldSelect,
  FieldRadioButton,
  FieldDateRangeInput,
  FieldCheckboxGroupWithQuantity } from '../../components';
import { formatMoney } from '../../util/currency';
import DateHourPicker, { getHours, isFullHours } from './DateHourPicker';
import DateMonthPicker from './DateMonthPicker';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import { types as sdkTypes } from '../../util/sdkLoader';
import { IconRocket } from '../../components';

import css from './BookingDatesForm.css';

const { Money } = sdkTypes;

const nextDate = date =>
  moment(date)
    .add(1, 'days')
    .toDate();

const moneyDivider = (money, divider) => {
  if(money instanceof Money) {
    let { amount, currency } = money;
    let total = parseInt((amount / divider)); // toFixed()
    return new Money(total, currency)
  } else {
    return null
  }
};

const converter = (item, currentUser) => {
  if(currentUser && item){
    let currency = null;
    let rates = [];
    if(currentUser.attributes.profile.protectedData.currency){
      currency = currentUser.attributes.profile.protectedData.currency;
      rates = currentUser.attributes.profile.protectedData.rates;
      const result = rates.find(e => e.iso_code == currency);
      if(result){
        item = item.substr(1)
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

const countHours = (dateHour) => {
  if (!dateHour) {
    return 0;
  }

  const firstDayHours = dateHour.firstDate ? getHours(dateHour.firstDate) : 0;
  const firstDateHours = new Decimal(firstDayHours);
  if (firstDayHours <= 0 || !firstDateHours.isInteger()) {
    throw new Error('Hour calculation failed');
  }

  // Calculation or extra days
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

const isChooseWorkspace = values => {  
  return (values.workspaces && values.workspaces.length !== 0)
};

const identity = v => v;

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
    const { 
      firstDate, 
      extraDays = [], 
      paymentMethod,
      workspaces,
      rental_type,
    } = values;

    const seats_quantity = values && values.seats_quantity ? parseInt(values.seats_quantity) : 0;
    const office_rooms_quantity = values && values.office_rooms_quantity ? parseInt(values.office_rooms_quantity) : 0;
    const meeting_rooms_quantity = values && values.meeting_rooms_quantity ? parseInt(values.meeting_rooms_quantity) : 0;
    
    let formatMessageLine = null;

    let dateHourLines = intl.formatMessage(
      { id: 'BookingDatesForm.bookingDateMessageDateHourLine' },
      { dateHourStart: "Start Date", dateHourEnd: "End Date" }
    );

    let sdtFinal = null;
    let edtFinal = null;
    let quantity = null;

    // Old way. For hourly
    if(rental_type === 'hourly') {
      const bookingDate = firstDate ? firstDate.bookingDate : null;

      try {
        quantity = countHours(values);
      } catch (e) {
        // No need to react - totalHours - quantity is just 0
      }

      if (!(bookingDate && bookingDate.date)) {
        this.setState({ focusedInput: 'bookingDate' });
      } else if (!hoursSelected(values)) {
        this.setState({ bookingHoursError: true });
      } else if (quantity > 0 && isFullHours(quantity)) {

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
        sdtFinal = new Date(sdtWithMin);

        var edt = new Date(bookingDate.date).setHours(Number(firstDate.hourEnd.split(':')[0]));
        var edtWithMin = new Date(edt).setMinutes(Number(firstDate.hourEnd.split(':')[1]));
        edtFinal = new Date(edtWithMin);

        formatMessageLine = dateData => {
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

        dateHourLines = extraDays.map(d => {
          return formatMessageLine(d);
        });
      }

    } else if (rental_type === 'daily') {

      sdtFinal = values &&
      values.bookingDates &&
      values.bookingDates.startDate ?
      values.bookingDates.startDate : null;
  
      edtFinal = values &&
        values.bookingDates &&
        values.bookingDates.endDate ?
        values.bookingDates.endDate : null;

      if (sdtFinal && edtFinal) {
        const startDateObj = moment(sdtFinal);
        const endDateObj = moment(edtFinal);           
        let duration = moment.duration(endDateObj.diff(startDateObj));
        quantity = duration.asDays();
      };

    } else if (rental_type === 'monthly') {

      sdtFinal = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;
      const { monthCount } = values;
      quantity = monthCount;
      edtFinal = sdtFinal ? moment(sdtFinal).add(monthCount, 'M').subtract(1,'d').toDate() : null;

    }    

    this.props.onSubmit({
      paymentMethod,
      workspaces,
      bookingDates: {
        startDate: sdtFinal,
        endDate: edtFinal,
      },
      bookingDatesWithTimes: {
        dateHourStart: sdtFinal,
        dateHourEnd: edtFinal,
      },
      hours: quantity, // it's no only hours, it's may be days or months. It is quantity
      message: [
        intl.formatMessage({ id: 'BookingDatesForm.bookingDateMessageFirstLine' }),
        // formatMessageLine(firstDate),
        "", 
        ...dateHourLines,
      ],
      seatsQuantity: seats_quantity,
      officeRoomsQuantity: office_rooms_quantity,
      meetingRoomsQuantity: meeting_rooms_quantity,
      rentalType: rental_type,
    });

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
        validate={values => {
          const errors = {}

          const names = config.custom.workspacesDefaultName;
          const quantityDefault = this.props.maxQuantity;
          const workspacesArray = values.workspaces ? values.workspaces : [];
          workspacesArray.map(function(item){
            let minQ = 1;
            let maxQ = quantityDefault[item];
            let currentQ = values[`${item}_quantity`];
            if(currentQ > maxQ || currentQ < 1 || !currentQ) {
              errors[`${item}_quantity`] = `${names[item]} value must be from ${minQ} to ${maxQ}`
            }
          });

          if(values && values.rental_type === "monthly") {
            const { monthCount } = values;
            if( !monthCount || monthCount === 0) {
              errors['monthCount'] = 'Number of months must be from 1'
            }
          };
          
          return Object.keys(errors).length ? errors : undefined
        }}
        render={fieldRenderProps => {
          const {
            datePlaceholder,
            form,
            formId,
            endDatePlaceholder,
            startDatePlaceholder,
            timeSlots,
            handleSubmit,
            intl,
            isOwnListing,
            listing,
            submitButtonWrapperClassName,
            unitPrice,
            unitType,
            values,
            seatsFee,
            officeRoomsFee,
            meetingRoomsFee,
            rentalTypes,
            currentUser,
            currentRentalType,
            handleChangeRentalType,
            avails,
          } = fieldRenderProps;

          const { firstDate, extraDays = [] } = values;

          const requiredSelect = required('This field is required');

          // Selected fee
          let selectedSeatsFee =
          values &&
          values.workspaces &&
          values.workspaces.indexOf('seats') != -1
            ? seatsFee
            : null;

          let selectedSeatsQuantity =
          values &&
          values.seats_quantity
            ? values.seats_quantity
            : null;

          let selectedOfficeRoomsFee =
          values &&
          values.workspaces &&
          values.workspaces.indexOf('office_rooms') != -1
            ? officeRoomsFee
            : null;

          const selectedOfficeRoomsQuantity =
          values &&
          values.office_rooms_quantity
            ? values.office_rooms_quantity
            : null;

          const selectedMeetingRoomsFee =
          values &&
          values.workspaces &&
          values.workspaces.indexOf('meeting_rooms') != -1
            ? meetingRoomsFee
            : null;

          const selectedMeetingRoomsQuantity =
          values &&
          values.meeting_rooms_quantity
            ? values.meeting_rooms_quantity
            : null;

          // Quantity and StartDate and EndDate calculations
          // Each quantity depends on rental_type. 
          // Quantity can be in hours, days, months.
          let quantity = null;
          let startDate = null;
          let endDate = null;

          if(currentRentalType === 'hourly') {

            try {
              quantity = countHours(values);
            } catch (e) {
              // No need to react - totalHours is just 0
            }
  
            startDate = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;
            endDate = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;

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
            };

          } else if (currentRentalType === 'daily') {

            startDate = values &&
            values.bookingDates &&
            values.bookingDates.startDate ?
            values.bookingDates.startDate : null;
        
            endDate = values &&
              values.bookingDates &&
              values.bookingDates.endDate ?
              values.bookingDates.endDate : null;

            if (startDate && endDate) {
              const startDateObj = moment(startDate);
              const endDateObj = moment(endDate);           
              let duration = moment.duration(endDateObj.diff(startDateObj));
              quantity = duration.asDays();
            };
            
          } else if (currentRentalType === 'monthly') {

            startDate = firstDate && firstDate.bookingDate ? firstDate.bookingDate.date : null;
            const { monthCount } = values;
            quantity = monthCount;
            endDate = startDate ? moment(startDate).add(monthCount, 'M').subtract(1,'d').toDate() : null;

          };

          // This is the place to collect breakdown estimation data. See the
          // EstimatedBreakdownMaybe component to change the calculations
          // for customised payment processes.
          const bookingData =
            startDate && endDate && quantity
              ? {
                unitType, 
                unitPrice, // no used

                startDate,
                endDate,
                quantity,

                seatsFee: selectedSeatsFee,
                officeRoomsFee: selectedOfficeRoomsFee,
                meetingRoomsFee: selectedMeetingRoomsFee,

                seatsQuantity: selectedSeatsQuantity,
                officeRoomsQuantity: selectedOfficeRoomsQuantity,
                meetingRoomsQuantity: selectedMeetingRoomsQuantity,

                currentRentalType,
              }
              : null;

            const bookingInfo = bookingData && isChooseWorkspace(values) ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} currentUser={currentUser} />
            </div>
          ) : null;

          
          // Definion of messages and texts
          const hoursError = this.state.bookingHoursError ? (
              <span className={css.hoursError}>
              <FormattedMessage id="BookingDatesForm.hoursError" />
            </span>
            ) : null;

          const bookingStartLabel = intl.formatMessage({
            id: 'BookingDatesForm.bookingStartTitle',
          });

          const bookingEndLabel = intl.formatMessage({ id: 'BookingDatesForm.bookingEndTitle' });
          const requiredMessage = intl.formatMessage({ id: 'BookingDatesForm.requiredDate' });
          const startDateErrorMessage = intl.formatMessage({
            id: 'FieldDateRangeInput.invalidStartDate',
          });
          const endDateErrorMessage = intl.formatMessage({
            id: 'FieldDateRangeInput.invalidEndDate',
          });

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };
          const now = moment();
          const today = now.startOf('day').toDate();
          const tomorrow = now
            .startOf('day')
            .add(1, 'days')
            .toDate();
          const startDatePlaceholderText =
            startDatePlaceholder || intl.formatDate(today, dateFormatOptions);
          const endDatePlaceholderText =
            endDatePlaceholder || intl.formatDate(tomorrow, dateFormatOptions);
          const submitButtonClasses = classNames(
            css.submitButtonWrapper,
            submitButtonWrapperClassName
          );

          const stripeConnected = (this.props.listing.author.
            attributes.profile.publicData.stripeEnabled == true);

          const workspacesNames = listing.attributes.publicData.workspaces ? 
            listing.attributes.publicData.workspaces
          : [];
          const workspacesFields = config.custom.workspaces.filter(function(item){
            return workspacesNames.indexOf(item.key) != -1
          });

          const publicDataObj = listing.attributes.publicData ? 
            listing.attributes.publicData
          : [];
          const defaultMaxQuantity = {
            seats: publicDataObj.seatsQuantity ? publicDataObj.seatsQuantity : 100,
            office_rooms: publicDataObj.officeRoomsQuantity ? publicDataObj.officeRoomsQuantity : 100,
            meeting_rooms: publicDataObj.meetingRoomsQuantity ? publicDataObj.meetingRoomsQuantity : 100,
          };
          const quickRent =  listing.attributes.publicData.quickRent
          const quantityErrors = [];
          if(fieldRenderProps.errors.seats_quantity) {
            quantityErrors.push(fieldRenderProps.errors.seats_quantity)
          };
          if(fieldRenderProps.errors.office_rooms_quantity) {
            quantityErrors.push(fieldRenderProps.errors.office_rooms_quantity)
          };
          if(fieldRenderProps.errors.meeting_rooms_quantity) {
            quantityErrors.push(fieldRenderProps.errors.meeting_rooms_quantity)
          };

          const selectedWorkspaces = values && values.workspaces ? values.workspaces : [];

          const fees = {
            seats: seatsFee ? `(${converter(formatMoney(intl, seatsFee), currentUser)})` : null,
            office_rooms: officeRoomsFee ? `(${converter(formatMoney(intl, officeRoomsFee), currentUser)})` : null,
            meeting_rooms: meetingRoomsFee ? `(${converter(formatMoney(intl, meetingRoomsFee), currentUser)})` : null,
          };

          const availsView = avails ? (
            <div className={css.availsBox}>
              <h3 className={css.availsTitle}>
                <FormattedMessage id="BookingPanel.availsTitle" />
              </h3>
              {avails.map((item, i) => {
                if(currentRentalType === "hourly") {
                  return (
                    <p key={i} className={css.availsItem}>
                      <span>{item.day}: </span>
                      <span>{item.hours}</span>
                    </p>
                  )
                } else {
                  return (
                    <span key={i} className={css.availsString}>{item.day} </span>
                  )
                }
              })}
            </div>
          ) : null;

          const rentalTypesFieldset = rentalTypes ? rentalTypes.map(item => {
            const label = intl.formatMessage({
              id: `EditListingPricingForm.rentalType_${item}`,
            });
            return (
              <FieldRadioButton
                id={`rental_type_${item}`}
                key={item}
                name={'rental_type'}
                label={label}
                value={item}
                onClick={e => handleChangeRentalType(e)}
              />
            )
          }) : null;

          let dateChoosBox = null;
          if(currentRentalType === 'hourly') {
            dateChoosBox = <DateHourPicker
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
          } else if (currentRentalType === 'daily') {
            dateChoosBox = <FieldDateRangeInput
              className={css.bookingDates}
              name="bookingDates"
              unitType={unitType}
              startDateId={`${form}.bookingStartDate`}
              startDateLabel={bookingStartLabel}
              startDatePlaceholderText={startDatePlaceholderText}
              endDateId={`${form}.bookingEndDate`}
              endDateLabel={bookingEndLabel}
              endDatePlaceholderText={endDatePlaceholderText}
              focusedInput={this.state.focusedInput}
              // onFocusedInputChange={this.onFocusedInputChange}
              format={identity}
              timeSlots={null} // All days must be available
              useMobileMargins
              validate={composeValidators(
                required(requiredMessage),
                bookingDatesRequired(startDateErrorMessage, endDateErrorMessage)
              )}
            />
          } else if (currentRentalType === 'monthly') {
            dateChoosBox = <DateMonthPicker
              id="firstDate"
              name="firstDate"
              className={css.DateMonthPicker}
              {...firstDate}
              intl={intl}
              values={values}
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
          };

          const googleTagTrackerSend = () => {
            if (!bookingData || !values || !values.workspaces) {
              return false;
            }
            window.gtag_report_conversion(listing.id.uuid)
          };

          const faceBookTrackerSend = () => {
            if (typeof (FB) === 'undefined') {
              return false;
            }

            let fb = window.FB;
            let fbParams = {};

            if (!bookingData || !values || !values.workspaces) {
              return false;
            }

            // calculate numItems:
            let numItems = 0;
            if (values.workspaces && (values.workspaces.indexOf('seats') !== -1)) {
              numItems = numItems + values.seats_quantity;
            }
            if (values.workspaces && (values.workspaces.indexOf('meeting_rooms') !== -1)) {
              numItems = numItems + values.meeting_rooms_quantity;
            }
            if (values.workspaces && (values.workspaces.indexOf('office_rooms') !== -1)) {
              numItems = numItems + values.office_rooms_quantity;
            }

            // calculate totalPrice:
            let totalPrice = 0;
            if (bookingData.meetingRoomsFee) {
              totalPrice = totalPrice +
                (bookingData.meetingRoomsFee.amount * bookingData.meetingRoomsQuantity);
            }
            if (bookingData.officeRoomsFee) {
              totalPrice = totalPrice +
                (bookingData.officeRoomsFee.amount * bookingData.officeRoomsQuantity);
            }
            if (bookingData.seatsFee) {
              totalPrice = totalPrice +
                (bookingData.seatsFee.amount * bookingData.seatsQuantity);
            }

            fbParams[fb.AppEvents.ParameterNames.DESCRIPTION] = listing.attributes.title;
            fbParams[fb.AppEvents.ParameterNames.CONTENT_ID] = listing.id.uuid;
            fbParams[fb.AppEvents.ParameterNames.CONTENT_TYPE] = 'listing';
            fbParams[fb.AppEvents.ParameterNames.NUM_ITEMS] = numItems;
            fbParams[fb.AppEvents.ParameterNames.PAYMENT_INFO_AVAILABLE] = 1;
            fbParams[fb.AppEvents.ParameterNames.CURRENCY] = listing.attributes.price.currency;

            fb.AppEvents.logEvent(fb.AppEvents.EventNames.INITIATED_CHECKOUT, totalPrice, fbParams);
          
          };

          return (
            <Form
              onSubmit={e => {
                faceBookTrackerSend();
                googleTagTrackerSend();
                if (currentRentalType === 'daily') {
                  if (startDate && endDate) {
                    handleSubmit(e);
                  } else if(!startDate) {
                    e.preventDefault();
                    this.setState({ focusedInput: 'startDate' });
                  } else if(!endDate) {
                    e.preventDefault();
                    this.setState({ focusedInput: 'endDate' });
                  }
                } else {
                  if (firstDate && firstDate.bookingDate) {
                    handleSubmit(e);
                  } else {
                    e.preventDefault();
                    this.setState({ focusedInput: 'bookingDate' });
                  }
                }
              }}
              className={classes}
            >

              <div className={css.rentalTypeWrapper}>
                <label>
                  <FormattedMessage id="BookingDatesForm.choosePlan" />
                </label>
                {rentalTypesFieldset}
              </div>

              {availsView}

              {dateChoosBox}

              <FieldCheckboxGroupWithQuantity
                className={css.workspaces}
                options={workspacesFields}
                intl={intl}
                quantityErrors={quantityErrors}
                selectedWorkspaces={selectedWorkspaces}
                defaultMaxQuantity={defaultMaxQuantity}
                fees={fees}
              />

              <FieldSelect className={css.paymentMethod} id="paymentMethod" name="paymentMethod" label="Choose payment method" validate={requiredSelect}>
                <option value="">Select payment</option>
                {stripeConnected ? (<option value="credit card">Credit card</option>) : null}
                <option value="cash">Cash</option>
              </FieldSelect>
 
              {currentRentalType === 'hourly' ? (
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
                        { hoursValid(values) && isChooseWorkspace(values) ? (
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
              ) : null}

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
                  {quickRent !== undefined && quickRent.length > 0 ? <IconRocket className={css.iconRocket} /> : ''}
                  <FormattedMessage id=
                    {quickRent !== undefined && quickRent.length > 0 ? "BookingDatesForm.quickRent" : "BookingDatesForm.requestToBook"} />
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

  listing: propTypes.listing,

  // for tests
  datePlaceholder: string,
};

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingDatesForm.displayName = 'BookingDatesForm';

export default BookingDatesForm;


