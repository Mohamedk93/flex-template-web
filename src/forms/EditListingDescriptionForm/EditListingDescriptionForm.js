import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup, FieldCheckboxGroupWithQuantity } from '../../components';
import config from '../../config';
import arrayMutators from 'final-form-arrays';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import CustomCurrencySelectFieldMaybe from './CustomCurrencySelectFieldMaybe';
import css from './EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    validate={values => {
      const errors = {}
      const names = config.custom.workspacesDefaultName;
      const quantityDefault = config.custom.workspacesDefaultQuantity;
      const workspacesArray = values.workspaces ? values.workspaces : [];
      workspacesArray.map(function(item){
        let minQ = 1;
        let maxQ = quantityDefault[item];
        let currentQ = values[`${item}_quantity`];
        if(currentQ > maxQ || currentQ < 1 || !currentQ) {
          errors[`${item}_quantity`] = `${names[item]} value must be from ${minQ} to ${maxQ}`
        }
      });
      return Object.keys(errors).length ? errors : undefined
    }}
    render={fieldRenderProps => {
      const {
        categories,
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
      } = fieldRenderProps;

      const selectedWorkspaces = values && values.workspaces ? values.workspaces : [];
      const titleMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const descriptionMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.description',
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionPlaceholder',
      });
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const descriptionRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionRequired',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

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

      return (
        <Form
          className={classes}
          onSubmit={handleSubmit}
        >
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={composeValidators(required(descriptionRequiredMessage))}
          />

          <CustomCategorySelectFieldMaybe
            id="category"
            name="category"
            categories={categories}
            intl={intl}
          />

          <CustomCurrencySelectFieldMaybe
            id="currency"
            name="currency"
            currencies={config.custom.currencies}
            intl={intl}
          />

          <FieldCheckboxGroupWithQuantity
            className={css.workspaces}
            options={config.custom.workspaces}
            intl={intl}
            quantityErrors={quantityErrors}
            selectedWorkspaces={selectedWorkspaces}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  currencies: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  workspaces: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);
