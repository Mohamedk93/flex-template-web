import React, { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { arrayOf, bool, func, node, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { propTypes, LISTING_STATE_CLOSED, LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import config from '../../config';
import { ModalInMobile, Button } from '../../components';
import { BookingDatesForm } from '../../forms';
import moment from 'moment';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './BookingPanel.css';

const { Money } = sdkTypes;

// This defines when ModalInMobile shows content as Modal
const MODAL_BREAKPOINT = 1023;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

const openBookModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), book: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeBookModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'book');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

export class BookingPanel extends Component {
  constructor(props) {
    super(props);

    const rentalTypes = this.props.listing.attributes.publicData.rentalTypes ?
      this.props.listing.attributes.publicData.rentalTypes : [];

    this.state = { 
      rentalType: rentalTypes[0],
    };

    this.handleChangeRentalType = this.handleChangeRentalType.bind(this);
  }

  handleChangeRentalType(e) {
    const rentalType = e.target.value;
    this.setState({ rentalType })
  }

  render() {
    const {
      rootClassName,
      className,
      titleClassName,
      listing,
      isOwnListing,
      unitType,
      onSubmit,
      title,
      subTitle,
      authorDisplayName,
      onManageDisableScrolling,
      timeSlots,
      fetchTimeSlotsError,
      history,
      location,
      intl,
    } = this.props;

    const publicData = listing.attributes.publicData;

    const currentRentalType = this.state.rentalType;
    
    
    // Prices calculation

    let seatsFeeData;
    if(currentRentalType === 'hourly') {
      seatsFeeData = publicData.priceSeatsHourly;
    } else if(currentRentalType === 'daily') {
      seatsFeeData = publicData.priceSeatsDaily;
    } else if(currentRentalType === 'monthly') {
      seatsFeeData = publicData.priceSeatsMonthly;
    };

    let officeRoomsFeeData;
    if(currentRentalType === 'hourly') {
      officeRoomsFeeData = publicData.priceOfficeRoomsHourly;
    } else if(currentRentalType === 'daily') {
      officeRoomsFeeData = publicData.priceOfficeRoomsDaily;
    } else if(currentRentalType === 'monthly') {
      officeRoomsFeeData = publicData.priceOfficeRoomsMonthly;
    };

    let meetingRoomsFeeData;
    if(currentRentalType === 'hourly') {
      meetingRoomsFeeData = publicData.priceMeetingRoomsHourly;
    } else if(currentRentalType === 'daily') {
      meetingRoomsFeeData = publicData.priceMeetingRoomsDaily;
    } else if(currentRentalType === 'monthly') {
      meetingRoomsFeeData = publicData.priceMeetingRoomsMonthly;
    };

    const { amount: seatsAmount, currency: seatsCurrency } =
      seatsFeeData || {};
    const seatsFee =
      seatsAmount && seatsCurrency
        ? new Money(seatsAmount, seatsCurrency)
        : null;

    const { amount: officeRoomsAmount, currency: officeRoomsCurrency } =
      officeRoomsFeeData || {};
    const officeRoomsFee =
      officeRoomsAmount && officeRoomsCurrency
        ? new Money(officeRoomsAmount, officeRoomsCurrency)
        : null;

    const { amount: meetingRoomsAmount, currency: meetingRoomsCurrency } =
      meetingRoomsFeeData || {};
    const meetingRoomsFee =
      meetingRoomsAmount && meetingRoomsCurrency
        ? new Money(meetingRoomsAmount, meetingRoomsCurrency)
        : null;


    const rentalTypes = publicData.rentalTypes;


    const handleSubmit = values => {
      const selectedSeatsFee =
        values &&
        values.workspaces &&
        values.workspaces.indexOf('seats') != -1
          ? seatsFee
          : null;
      const selectedOfficeRoomsFee =
      values &&
      values.workspaces &&
      values.workspaces.indexOf('office_rooms') != -1
        ? officeRoomsFee
        : null;
      const selectedMeetingRoomsFee =
      values &&
      values.workspaces &&
      values.workspaces.indexOf('meeting_rooms') != -1
        ? meetingRoomsFee
        : null;
      onSubmit({
        ...values,
        seatsFee: selectedSeatsFee,
        officeRoomsFee: selectedOfficeRoomsFee,
        meetingRoomsFee: selectedMeetingRoomsFee,
      });
    };

    const price = listing.attributes.price;
    const hasListingState = !!listing.attributes.state;
    const isClosed = hasListingState && listing.attributes.state === LISTING_STATE_CLOSED;
    const showBookingDatesForm = hasListingState && !isClosed;
    const showClosedListingHelpText = listing.id && isClosed;
    const { formattedPrice, priceTitle } = priceData(price, intl);
    const isBook = !!parse(location.search).book;

    const subTitleText = !!subTitle
      ? subTitle
      : showClosedListingHelpText
      ? intl.formatMessage({ id: 'BookingPanel.subTitleClosedListing' })
      : null;

    const isNightly = unitType === LINE_ITEM_NIGHT;
    const isDaily = unitType === LINE_ITEM_DAY;

    const unitTranslationKey = 'BookingPanel.perHour';

    const classes = classNames(rootClassName || css.root, className);
    const titleClasses = classNames(titleClassName || css.bookingTitle);

    let avails = [];
    if(timeSlots) {
      let days = [];
      timeSlots.forEach(function(item) {
        let day = moment(item.attributes.start).format("dddd");
        if(days.indexOf(day) === -1) {
          days.push(day);
          let startTime = moment(item.attributes.start).format("LT");
          let endTime = moment(item.attributes.end).format("LT");
          avails.push({day: day, hours: startTime + " - " + endTime});
        }
      });
    };

    const sorter = {
      "monday": 1,
      "tuesday": 2,
      "wednesday": 3,
      "thursday": 4,
      "friday": 5,
      "saturday": 6,
      "sunday": 7
    };

    avails.sort(function sortByDay(a, b) {
      let day1 = a.day.toLowerCase();
      let day2 = b.day.toLowerCase();
      return sorter[day1] - sorter[day2];
    });

    const maxQuantity = {
      seats: publicData.seatsRoomsQuantity ? publicData.seatsQuantity : 500,
      office_rooms: publicData.officeRoomsQuantity ? publicData.officeRoomsQuantity : 100,
      meeting_rooms: publicData.meetingRoomsQuantity ? publicData.meetingRoomsQuantity : 100,
    };

    return (
      <div className={classes}>
        <ModalInMobile
          containerClassName={css.modalContainer}
          id="BookingDatesFormInModal"
          isModalOpenOnMobile={isBook}
          onClose={() => closeBookModal(history, location)}
          showAsModalMaxWidth={MODAL_BREAKPOINT}
          onManageDisableScrolling={onManageDisableScrolling}
        >
          <div className={css.modalHeading}>
            <h1 className={css.title}>{title}</h1>
            <div className={css.author}>
              <FormattedMessage id="BookingPanel.hostedBy" values={{ name: authorDisplayName }} />
            </div>
          </div>

          <div className={css.bookingHeading}>
            <h2 className={titleClasses}>{title}</h2>
            {/* {subTitleText ? <div className={css.bookingHelp}>{subTitleText}</div> : null} */}
          </div>
          {showBookingDatesForm ? (
            <BookingDatesForm
              avails={avails}
              className={css.bookingForm}
              formId="BookingPanel"
              submitButtonWrapperClassName={css.bookingDatesSubmitButtonWrapper}
              unitType={unitType}
              onSubmit={handleSubmit}
              price={price}
              isOwnListing={isOwnListing}
              timeSlots={timeSlots}
              listing={listing}
              fetchTimeSlotsError={fetchTimeSlotsError}
              seatsFee={seatsFee}
              officeRoomsFee={officeRoomsFee}
              meetingRoomsFee={meetingRoomsFee}
              maxQuantity={maxQuantity}
              rentalTypes={rentalTypes}
              handleChangeRentalType={this.handleChangeRentalType}
              currentRentalType={currentRentalType}
              initialValues={{ 
                seats_quantity: 1,
                office_rooms_quantity: 1,
                meeting_rooms_quantity: 1,
                rental_type: rentalTypes[0]
              }}
            />
          ) : null}
        </ModalInMobile>
        <div className={css.openBookingForm}>
          <div className={css.priceContainer}>
            <div className={css.priceValue} title={priceTitle}>
              {formattedPrice}
            </div>
            <div className={css.perUnit}>
              <FormattedMessage id={unitTranslationKey} />
            </div>
          </div>

          {showBookingDatesForm ? (
            <Button
              rootClassName={css.bookButton}
              onClick={() => openBookModal(isOwnListing, isClosed, history, location)}
            >
              <FormattedMessage id="BookingPanel.ctaButtonMessage" />
            </Button>
          ) : (
            <div className={css.closedListingButton}>
              <FormattedMessage id="BookingPanel.closedListingButtonText" />
            </div>
          )}
        </div>
      </div>
    );
  }
};

BookingPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.bookingUnitType,
  timeSlots: null,
  fetchTimeSlotsError: null,
};

BookingPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.bookingUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  authorDisplayName: oneOfType([node, string]).isRequired,
  onManageDisableScrolling: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(
  withRouter,
  injectIntl
)(BookingPanel);
