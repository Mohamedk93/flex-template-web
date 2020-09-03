import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import Decimal from 'decimal.js';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';
import {
  propTypes,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';

import css from './BookingBreakdown.css';

const { Money } = sdkTypes;

/**
 * Calculates the total price in sub units for multiple line items.
 */
const lineItemsTotal = lineItems => {
  const amount = lineItems.reduce((total, item) => {
    return total.plus(item.lineTotal.amount);
  }, new Decimal(0));
  return new Money(amount, config.currency);
};

/**
 * Checks if line item represents commission
 */
const isCommission = lineItem => {
  return (
    lineItem.code === LINE_ITEM_PROVIDER_COMMISSION ||
    lineItem.code === LINE_ITEM_CUSTOMER_COMMISSION
  );
};

/**
 * Returns non-commission, reversal line items
 */
const nonCommissionReversalLineItems = transaction => {
  return transaction.attributes.lineItems.filter(item => !isCommission(item) && item.reversal);
};

const LineItemRefundMaybe = props => {
  const { transaction, intl, currentUser } = props;

  // all non-commission, reversal line items
  const refundLineItems = nonCommissionReversalLineItems(transaction);

  const refund = lineItemsTotal(refundLineItems);

  let formattedRefund = refundLineItems.length > 0 ? formatMoney(intl, refund) : null;

  if(currentUser && currentUser.attributes.profile.protectedData.currency && formattedRefund){
    let currency = currentUser.attributes.profile.protectedData.currency;
    let rates = currentUser.attributes.profile.protectedData.rates;
    const result = rates.find(e => e.iso_code == currency);
    if(result){
      formattedRefund = formattedRefund.substr(2).replace(/,/g, '').replace('$', '');
      formattedRefund = formattedRefund * result.current_rate
      formattedRefund = formattedRefund.toFixed(2);
      formattedRefund = '-' + result.symbol.toString() + formattedRefund;
    }
  }
  return formattedRefund ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.refund" />
      </span>
      <span className={css.itemValue}>{formattedRefund}</span>
    </div>
  ) : null;
};

LineItemRefundMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemRefundMaybe;
