import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { 
  LINE_ITEM_SEATS_FEE,
  LINE_ITEM_OFFICE_ROOMS_FEE,
  LINE_ITEM_MEETING_ROOMS_FEE,
  propTypes 
} from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit, formatMoney } from '../../util/currency';
import Decimal from 'decimal.js';
import { types as sdkTypes } from '../../util/sdkLoader';
import css from './BookingBreakdown.css';
const { Money } = sdkTypes;


const LineItemCustomPrices = props => {
  const { transaction, unitType, intl } = props;

  const mainLineItems = transaction.attributes.lineItems.filter((item) => {
    return item.code === LINE_ITEM_SEATS_FEE || item.code === LINE_ITEM_OFFICE_ROOMS_FEE || item.code === LINE_ITEM_MEETING_ROOMS_FEE
  });

  return mainLineItems ? mainLineItems.map((item) => {
    const key = item.code.split('/')[1];
    const quantity = item.quantity;
    const currency = item.unitPrice.currency;

    const numericTotalPrice = new Decimal(convertMoneyToNumber(item.unitPrice))
      .mul(quantity)
      .toNumber();
    const totalPrice = new Money(
      convertUnitToSubUnit(numericTotalPrice, unitDivisor(currency)),
      currency
    );

    const formattedTotalPrice = formatMoney(intl, totalPrice);

    const formattedUnitPrice = formatMoney(intl, item.unitPrice);

    return (
      <div className={css.lineItem} key={key}>
        <span className={css.itemLabel}>
          <FormattedMessage id={`BookingBreakdown.quantity_${key}`} values={{quantity: quantity.toFixed(), price: formattedUnitPrice}} />
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
