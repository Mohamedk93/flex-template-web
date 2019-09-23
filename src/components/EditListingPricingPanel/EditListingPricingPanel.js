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
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { price, publicData } = currentListing.attributes;
  const workspaces = publicData.workspaces ? publicData.workspaces : null;

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

  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={{ 
        price_seats: publicData.priceSeats,
        price_office_rooms: publicData.priceOfficeRooms,
        price_meeting_rooms: publicData.priceMeetingRooms,
      }}
      onSubmit={values => {
        const { price_seats, price_office_rooms, price_meeting_rooms } = values;
        const nullPrice = {
          amount: 0,
          currency: 'USD',
        };
        const priceArray = [price_seats, price_office_rooms, price_meeting_rooms].map(function(x) {
          if(x !== undefined && x !== null){
            return x.amount
          }
        });
        const minimalPrice = {
          amount: Array.min(priceArray),
          currency: 'USD',
        };
        const priceSeats = price_seats ? {
          amount: price_seats.amount,
          currency: price_seats.currency,
        } : nullPrice;
        const priceOfficeRooms = price_office_rooms ? {
          amount: price_office_rooms.amount,
          currency: price_office_rooms.currency,
        } : nullPrice;
        const priceMeetingRooms = price_meeting_rooms ? {
          amount: price_meeting_rooms.amount,
          currency: price_meeting_rooms.currency,
        } : nullPrice;
        const updateValues = {
          price: minimalPrice,
          publicData: { 
            priceSeats,
            priceOfficeRooms,
            priceMeetingRooms,
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
