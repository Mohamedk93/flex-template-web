import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import {
  intlShape,
  injectIntl,
  FormattedMessage,
} from '../../util/reactIntl';
import { propTypes } from '../util/types';
import { required } from '../util/validators';
import { Form, Button, FieldSelect } from '../components';

// Create this file using EditListingFeaturesForm.css
// as a template.
import css from './EditListingWorkspaceForm.css';

export const EditListingWorkspaceFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
        workspaceOptions,
      } = fieldRenderProps;

      const workspacePlaceholder = intl.formatMessage({
        id: 'EditListingWorkspaceForm.workspacePlaceholder',
      });

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingWorkspaceForm.updateFailed" />
        </p>
      ) : null;

      const workspaceRequired = required(
        intl.formatMessage({
          id: 'EditListingWorkspaceForm.WorkspaceRequired',
        })
      );

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}

          <FieldSelect
            className={css.workspace}
            name="workspaces"
            id="workspaces"
            validate={workspaceRequired}
          >
            <option value="">{workspacePlaceholder}</option>
            {workspaceOptions.map(c => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </FieldSelect>

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

EditListingWorkspaceFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingWorkspaceFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  workspaceOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
};

export default compose(injectIntl)(EditListingWorkspaceFormComponent);