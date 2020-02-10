import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney, converter } from '../../util/currency';
import { propTypes, LINE_ITEM_PROVIDER_COMMISSION } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemProviderCommissionRefundMaybe = props => {
  const { transaction, isProvider, intl, currentUser } = props;

  let refund = transaction.attributes.lineItems.find(
    item => item.code === LINE_ITEM_PROVIDER_COMMISSION && item.reversal
  );

  return isProvider && refund ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.refundProviderFee" />
      </span>
      <span className={css.itemValue}>{converter(formatMoney(intl, refund.lineTotal), currentUser)}</span>
    </div>
  ) : null;
};

LineItemProviderCommissionRefundMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemProviderCommissionRefundMaybe;
