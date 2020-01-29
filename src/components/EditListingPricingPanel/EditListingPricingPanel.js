import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';


import css from './EditListingPricingPanel.css';
import { currentUserShowError } from '../../ducks/user.duck';

const { Money } = sdkTypes;

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

const EditListingPricingPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    currentUser,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { price, publicData } = currentListing.attributes;
  const workspaces = publicData.workspaces ? publicData.workspaces : null;
  const rentalTypes = publicData.rentalTypes ? publicData.rentalTypes : null;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  );

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;

  const author =  props.listing.author;
  const price_seats_hourly = publicData && publicData.priceSeatsHourly && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsHourly.amount, publicData.priceSeatsHourly.currency) : null;
  const price_seats_daily = publicData && publicData.priceSeatsDaily && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsDaily.amount, publicData.priceSeatsDaily.currency) : null;
  const price_seats_monthly = publicData && publicData.priceSeatsMonthly && publicData.workspaces.indexOf('seats') !== -1 ? new Money(publicData.priceSeatsMonthly.amount, publicData.priceSeatsMonthly.currency) : null;

  const price_office_rooms_hourly = publicData && publicData.priceOfficeRoomsHourly && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsHourly.amount, publicData.priceOfficeRoomsHourly.currency) : null;
  const price_office_rooms_daily = publicData && publicData.priceOfficeRoomsDaily && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsDaily.amount, publicData.priceOfficeRoomsDaily.currency) : null;
  const price_office_rooms_monthly = publicData && publicData.priceOfficeRoomsMonthly && publicData.workspaces.indexOf('office_rooms') !== -1 ? new Money(publicData.priceOfficeRoomsMonthly.amount, publicData.priceOfficeRoomsMonthly.currency) : null;

  const price_meeting_rooms_hourly = publicData && publicData.priceMeetingRoomsHourly && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsHourly.amount, publicData.priceMeetingRoomsHourly.currency) : null;
  const price_meeting_rooms_daily = publicData && publicData.priceMeetingRoomsDaily && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsDaily.amount, publicData.priceMeetingRoomsDaily.currency) : null;
  const price_meeting_rooms_monthly = publicData && publicData.priceMeetingRoomsMonthly && publicData.workspaces.indexOf('meeting_rooms') !== -1 ? new Money(publicData.priceMeetingRoomsMonthly.amount, publicData.priceMeetingRoomsMonthly.currency) : null;
  // if(!publicData.rates){
  //   publicData.rates = "USD"
  // }

  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={{
        currency: publicData.currency,
        price_seats_hourly,
        price_seats_daily,
        price_seats_monthly,
        price_office_rooms_hourly,
        price_office_rooms_daily,
        price_office_rooms_monthly,
        price_meeting_rooms_hourly,
        price_meeting_rooms_daily,
        price_meeting_rooms_monthly,
        quickRent: publicData.quickRent,
        author: author,
        currentUser: currentUser,
      }}
      onSubmit={values => {
        const {
          price_seats_hourly,
          price_seats_daily,
          price_seats_monthly,
          price_office_rooms_hourly,
          price_office_rooms_daily,
          price_office_rooms_monthly,
          price_meeting_rooms_hourly,
          price_meeting_rooms_daily,
          price_meeting_rooms_monthly,
          quickRent,
          currency,
        } = values;

        const nullPrice = {
          amount: 0,
          currency: 'USD',
        };

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
        const minimalPrice = {
          amount: Array.min(priceArray),
          currency: 'USD',
        };

        const priceSeatsHourly = price_seats_hourly ? {
          amount: price_seats_hourly.amount,
          currency: price_seats_hourly.currency,
        } : nullPrice;
        const priceSeatsDaily = price_seats_daily ? {
          amount: price_seats_daily.amount,
          currency: price_seats_daily.currency,
        } : nullPrice;
        const priceSeatsMonthly = price_seats_monthly ? {
          amount: price_seats_monthly.amount,
          currency: price_seats_monthly.currency,
        } : nullPrice;

        const priceOfficeRoomsHourly = price_office_rooms_hourly ? {
          amount: price_office_rooms_hourly.amount,
          currency: price_office_rooms_hourly.currency,
        } : nullPrice;
        const priceOfficeRoomsDaily = price_office_rooms_daily ? {
          amount: price_office_rooms_daily.amount,
          currency: price_office_rooms_daily.currency,
        } : nullPrice;
        const priceOfficeRoomsMonthly = price_office_rooms_monthly ? {
          amount: price_office_rooms_monthly.amount,
          currency: price_office_rooms_monthly.currency,
        } : nullPrice;

        const priceMeetingRoomsHourly = price_meeting_rooms_hourly ? {
          amount: price_meeting_rooms_hourly.amount,
          currency: price_meeting_rooms_hourly.currency,
        } : nullPrice;
        const priceMeetingRoomsDaily = price_meeting_rooms_daily ? {
          amount: price_meeting_rooms_daily.amount,
          currency: price_meeting_rooms_daily.currency,
        } : nullPrice;
        const priceMeetingRoomsMonthly = price_meeting_rooms_monthly ? {
          amount: price_meeting_rooms_monthly.amount,
          currency: price_meeting_rooms_monthly.currency,
        } : nullPrice;

        const updateValues = {
          price: minimalPrice,
          publicData: {
            priceSeatsHourly,
            priceSeatsDaily,
            priceSeatsMonthly,
            priceOfficeRoomsHourly,
            priceOfficeRoomsDaily,
            priceOfficeRoomsMonthly,
            priceMeetingRoomsHourly,
            priceMeetingRoomsDaily,
            priceMeetingRoomsMonthly,
            quickRent,
            currency,
          },
        };
        onSubmit(updateValues);
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
      workspaces={workspaces}
      rentalTypes={rentalTypes}
      currencies={config.custom.currencies}
    />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingPricingPanel;
