import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { EditListingDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingDescriptionPanel.css';

const EditListingDescriptionPanel = props => {
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
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingDescriptionPanel.createListingTitle" />
    );


    

  const currency = publicData.currency ? publicData.currency : 'usd';
  const seats_quantity = publicData.seatsQuantity ? publicData.seatsQuantity : 1;
  const office_rooms_quantity = publicData.officeRoomsQuantity ? publicData.officeRoomsQuantity : 1;
  const meeting_rooms_quantity = publicData.meetingRoomsQuantity ? publicData.meetingRoomsQuantity : 1;

  console.log(currency)

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
   
    <p>
    Adding your workspace is 100% free, and we only earn a 10% commission on successful transactions. <br/>
    <br/>
    Benefits and enhanced functions for your workspace:<br/>
    </p>
<ul className={css.a}>
<li>Create a digital experience for your customers without spending any development cost</li>
<li>Enable online booking of your workspace in a few clicksEnable card payments directly to your bank account (select countries only) or receive the amount in cash</li>
<li>Automated invoicing upon customer booking</li>
<li>Booking requests are sent to you for approval before customer confirmation via our App and Website </li>
<li>You can rent seats, meeting rooms or office rooms </li>
<li>You can rent your space by the hour, day or month </li>
</ul>
<p> Our fee is either directly netted from the amount you receive for card payments, or you can transfer it to us at the end of each month for cash payments.
 </p>
 
      <EditListingDescriptionForm
        className={css.form}
        initialValues={{
          title,
          description,
          currency: publicData.currency,
          category: publicData.category,
          workspaces: publicData.workspaces,
          seats_quantity,
          office_rooms_quantity,
          meeting_rooms_quantity,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          console.log(values)
          const {
            title,
            description,
            category,
            currency,
            workspaces,
            seats_quantity,
            office_rooms_quantity,
            meeting_rooms_quantity,
          } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              category,
              currency,
              workspaces,
              seatsQuantity: seats_quantity ? parseInt(seats_quantity) : 0,
              officeRoomsQuantity: office_rooms_quantity ? parseInt(office_rooms_quantity) : 0,
              meetingRoomsQuantity: meeting_rooms_quantity ? parseInt(meeting_rooms_quantity) : 0,
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={config.custom.categories}
      />
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
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

export default EditListingDescriptionPanel;
