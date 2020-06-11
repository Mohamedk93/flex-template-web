import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data.js';
import { findOptionsForSelectFilter } from '../../util/search';
import { ListingLink } from '../../components';
import { EditListingWorkspaceForm } from '../../forms';
import config from '../../config.js';

// Create this file using EditListingDescriptionPanel.css
// as a template.
import css from './EditListingWorkspacePanel.css';

const EditListingWorkspacePanel = props => {
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
  const { publicData } = currentListing.attributes;

  const panelTitle = currentListing.id ? (
    <FormattedMessage
      id="EditListingWorkspacePanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingWorkspacePanel.createListingTitle" />
  );
  const workspaceOptions = findOptionsForSelectFilter(
    'workspaces',
    config.custom.filters
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingWorkspaceForm
        className={css.form}
        initialValues={{ workspaces: publicData.workspaces }}
        onSubmit={values => {
          const { workspaces } = values;
          const updateValues = {
            publicData: {
              workspaces,
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        workspaceOptions={workspaceOptions}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingWorkspacePanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingWorkspacePanel.propTypes = {
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

export default EditListingWorkspacePanel;