import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { txIsCanceled, txIsDelivered, txIsDeclined } from '../../util/transaction';
import { propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemUnitPrice = props => {
  const { transaction, isProvider, intl, currentUser } = props;

  let providerTotalMessageId = 'BookingBreakdown.providerTotalDefault';
  if (txIsDelivered(transaction)) {
    providerTotalMessageId = 'BookingBreakdown.providerTotalDelivered';
  } else if (txIsDeclined(transaction)) {
    providerTotalMessageId = 'BookingBreakdown.providerTotalDeclined';
  } else if (txIsCanceled(transaction)) {
    providerTotalMessageId = 'BookingBreakdown.providerTotalCanceled';
  }

  const totalLabel = isProvider ? (
    <FormattedMessage id={providerTotalMessageId} />
  ) : (
    <FormattedMessage id="BookingBreakdown.total" />
  );

  const totalPrice = isProvider
    ? transaction.attributes.payoutTotal
    : transaction.attributes.payinTotal;
  let formattedTotalPrice = formatMoney(intl, totalPrice);
  
  if(currentUser){
    let currency = null;
    let rates = [];
    if(currentUser.attributes.profile.protectedData.currency){
      currency = currentUser.attributes.profile.protectedData.currency;
      rates = currentUser.attributes.profile.protectedData.rates;
      const result = rates.find(e => e.iso_code == currency);
      if(result){
        formattedTotalPrice = formattedTotalPrice.substr(1)
        formattedTotalPrice = formattedTotalPrice * result.current_rate
        formattedTotalPrice = formattedTotalPrice.toFixed(2);
        formattedTotalPrice = result.symbol.toString() + formattedTotalPrice;
      }
    }
  }
  return (
    <>
      <hr className={css.totalDivider} />
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{formattedTotalPrice}</div>
      </div>
    </>
  );
};

LineItemUnitPrice.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isProvider: bool.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemUnitPrice;
