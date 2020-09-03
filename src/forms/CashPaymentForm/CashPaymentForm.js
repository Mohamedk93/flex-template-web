import React from 'react';
import { string, bool } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import { Form, PrimaryButton, FieldTextInput, IconEnquiry } from '../../components';
import * as validators from '../../util/validators';
import { propTypes } from '../../util/types';
import { IconLightning } from '../../components';

import css from './CashPaymentForm.css';

const CashPaymentFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        submitButtonWrapperClassName,
        formId,
        handleSubmit,
        inProgress,
        listingTitle,
        listing,
      } = fieldRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = submitInProgress;
      const quickRent = listing.attributes.publicData.quickRent

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <h2 className={css.heading}>
            { listingTitle }
          </h2>
          <div className={submitButtonWrapperClassName}>
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              {quickRent !== undefined && quickRent.length > 0 ? <IconLightning className={css.iconLightning} /> : ''}
              <FormattedMessage id="Confirm booking" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

CashPaymentFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  inProgress: false,
};

CashPaymentFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  inProgress: bool,

  listingTitle: string.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const CashPaymentForm = compose(injectIntl)(CashPaymentFormComponent);

CashPaymentForm.displayName = 'CashPaymentForm';

export default CashPaymentForm;
