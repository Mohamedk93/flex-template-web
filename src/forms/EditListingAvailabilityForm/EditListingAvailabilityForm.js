import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import arrayMutators from 'final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, Button, FieldCheckboxGroup } from '../../components';
import { requiredFieldArrayCheckbox } from '../../util/validators';
import ManageAvailabilitySelectGroup from './ManageAvailabilitySelectGroup';
import css from './EditListingAvailabilityForm.css';

export class EditListingAvailabilityFormComponent extends Component {
  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{ ...arrayMutators }}
        render={fieldRenderProps => {
          const {
            className,
            rootClassName,
            disabled,
            handleSubmit,
            intl,
            invalid,
            name,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availability,
            availabilityPlan,
            values,
            listingId,
            errors,
          } = fieldRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const availabilityPlanLabel = intl.formatMessage({ id: 'EditListingAvailabilityForm.daysAvailable' });
          const rentalLabel = intl.formatMessage({ id: 'EditListingAvailabilityForm.howRental' });
          const rentalTypesRequiredMessage = intl.formatMessage({ id: 'EditListingAvailabilityForm.rentalRequired' });

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = updated && pristine;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;

          const errorWeekdays = errors.weekdays ? errors.weekdays : null;

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}
              <div className={css.calendarWrapper}>
                <ManageAvailabilitySelectGroup
                  className={css.days}
                  id={name}
                  intl={intl}
                  name={name}
                  values={values}
                  options={config.custom.weekDays}
                  availability={availability}
                  availabilityPlan={availabilityPlan}
                  listingId={listingId}
                  label={availabilityPlanLabel}
                  errorWeekdays={errorWeekdays}
                />
                <label className={css.availLabel}>{rentalLabel}</label>
                <FieldCheckboxGroup
                  className={css.rentalTypesList}
                  id={"rental_types"}
                  name={"rental_types"}
                  options={config.custom.rentals}
                  validate={requiredFieldArrayCheckbox(rentalTypesRequiredMessage)}
                />
              </div>

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
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
