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

  const seats_quantity = publicData.seatsQuantity ? publicData.seatsQuantity : 1;
  const office_rooms_quantity = publicData.officeRoomsQuantity ? publicData.officeRoomsQuantity : 1;
  const meeting_rooms_quantity = publicData.meetingRoomsQuantity ? publicData.meetingRoomsQuantity : 1;

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={{ 
          title, 
          description, 
          category: publicData.category, 
          workspaces: publicData.workspaces,
          seats_quantity,
          office_rooms_quantity,
          meeting_rooms_quantity,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { 
            title, 
            description, 
            category,
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
