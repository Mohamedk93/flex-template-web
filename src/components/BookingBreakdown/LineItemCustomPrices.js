import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import {
  LINE_ITEM_SEATS_FEE,
  LINE_ITEM_OFFICE_ROOMS_FEE,
  LINE_ITEM_MEETING_ROOMS_FEE,
  propTypes,
  LINE_ITEM_COUPON_DISCOUNT
} from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit, formatMoney } from '../../util/currency';
import Decimal from 'decimal.js';
import { types as sdkTypes } from '../../util/sdkLoader';
import css from './BookingBreakdown.css';
const { Money } = sdkTypes;

const converter = (item, currentUser) => {
  let currency = null;
  let rates = [];
  let result = null;
  if(currentUser && item && currentUser.attributes.profile.protectedData.currency){
    currency = currentUser.attributes.profile.protectedData.currency;
    rates = currentUser.attributes.profile.protectedData.rates;
    result = rates.find(e => e.iso_code == currency);
  }else {
    rates = JSON.parse(localStorage.getItem('rates'));
    currency = localStorage.getItem('currentCode');
    result = rates.find(e => e.iso_code == currency);
  }
  if(result){
    item = item.substr(1).replace(/,/g, '');
    item = item.replace('$', '');
    item = item * result.current_rate
    item = item.toFixed(2);
    item = result.symbol.toString() + item;
  }
  return item;
}

const LineItemCustomPrices = props => {
  const { transaction, unitType, intl, currentUser, promo } = props;
  
  const mainLineItems = transaction.attributes.lineItems.filter((item) => {
    return item.code === LINE_ITEM_SEATS_FEE || item.code === LINE_ITEM_OFFICE_ROOMS_FEE || item.code === LINE_ITEM_MEETING_ROOMS_FEE || item.code === LINE_ITEM_COUPON_DISCOUNT
  });

  const guid = () =>
    `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

  return mainLineItems ? mainLineItems.map((item) => {
    console.log("[Tanawy is debugging here in LineItemCustomPrices.js]", item);
    const key = item.code.split('/')[1];
    const quantity = item.quantity;
    const currency = item.unitPrice.currency;
    const fiexed = false;
    const numericTotalPrice = new Decimal(convertMoneyToNumber(item.unitPrice))
      .mul(quantity)
      .toNumber();
    let totalPrice = new Money(
      convertUnitToSubUnit(numericTotalPrice, unitDivisor(currency)),
      currency
    );


    const capValToMoney = new Money(
      convertUnitToSubUnit(((promo||{}).cap||50),unitDivisor(currency))
      ,currency
      );

    let formattedTotalPrice = converter(formatMoney(intl, totalPrice), currentUser);

    let formattedUnitCap = capValToMoney?converter(formatMoney(intl,capValToMoney), currentUser):undefined;
    
    let formattedUnitPrice = converter(formatMoney(intl, item.unitPrice), currentUser);
    const promoDiscount = (promo || {}).value;


    return (
      <div className={css.lineItem} key={guid()}>
        <span className={css.itemLabel}>
          <FormattedMessage id={`BookingBreakdown.quantity_${key}`} values={{quantity: quantity.toFixed(), price: formattedUnitPrice, cap: formattedUnitCap, discount: promoDiscount}} />
        </span>
        <span className={css.itemValue}>
          {formattedTotalPrice}
        </span>
      </div>
    )
  }) : null;
};

LineItemCustomPrices.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
};

export default LineItemCustomPrices;
