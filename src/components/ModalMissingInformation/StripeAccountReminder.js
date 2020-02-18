import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { NamedLink } from '../../components';
import { IconWarning } from '../../components';

import css from './ModalMissingInformation.css';

const StripeAccountReminder = props => {
  const { className, stripeDialog } = props;
  const dialogText = stripeDialog ? (
    <FormattedMessage id="ModalMissingInformation.missingStripeAccountTextSecond" />
  ) : (
    <FormattedMessage id="ModalMissingInformation.missingStripeAccountText" />
  )
  return (
    <div className={className}>
      <div>
        <IconWarning/>
      </div>
      <p className={css.modalTitle}>
        <FormattedMessage id="ModalMissingInformation.missingStripeAccountTitle" />
      </p>
      <p className={css.modalMessage}>
        {dialogText}
      </p>
      <div className={css.bottomWrapper}>
        <NamedLink className={css.reminderModalLinkButton} name="StripePayoutPage">
          <FormattedMessage id="ModalMissingInformation.gotoPaymentSettings" />
        </NamedLink>
      </div>
    </div>
  );
};

export default StripeAccountReminder;
