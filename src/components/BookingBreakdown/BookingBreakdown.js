/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import React from 'react';
import { oneOf, string } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import {
  propTypes,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';

import LineItemBookingHours from './LineItemBookingHours';
import LineItemBookingDays from './LineItemBookingDays';
import LineItemCustomPrices from './LineItemCustomPrices';
import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
import LineItemRefundMaybe from './LineItemRefundMaybe';
import LineItemTotalPrice from './LineItemTotalPrice';

import css from './BookingBreakdown.css';

export const BookingBreakdownComponent = props => {
  const {
    rootClassName,
    className,
    userRole,
    unitType,
    transaction,
    booking,
    intl,
    dateType,
    currentRentalType,
    currentUser,
  } = props;

  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const hasCommissionLineItem = transaction.attributes ? transaction.attributes.lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  }) : false;

  const classes = classNames(rootClassName || css.root, className);

  /**
   * BookingBreakdown contains different line items:
   *
   * LineItemBookingPeriod: prints booking start and booking end types. Prop dateType
   * determines if the date and time or only the date is shown
   *
   * LineItemUnitsMaybe: if he unitType is line-item/unit print the name and
   * quantity of the unit
   *
   * LineItemBasePriceMaybe: prints the base price calculation for the listing, e.g.
   * "$150.00 * 2 nights $300"
   *
   * LineItemUnitPriceMaybe: prints just the unit price, e.g. "Price per night $32.00".
   * This line item is not used by default in the BookingBreakdown.
   *
   * LineItemUnknownItemsMaybe: prints the line items that are unknown. In ideal case there
   * should not be unknown line items. If you are using custom pricing, you should create
   * new custom line items if you need them.
   *
   * LineItemSubTotalMaybe: prints subtotal of line items before possible
   * commission or refunds
   *
   * LineItemRefundMaybe: prints the amount of refund
   *
   * LineItemCustomerCommissionMaybe: prints the amount of customer commission
   * The default transaction process used by FTW doesn't include the customer commission.
   *
   * LineItemCustomerCommissionRefundMaybe: prints the amount of refunded customer commission
   *
   * LineItemProviderCommissionMaybe: prints the amount of provider commission
   *
   * LineItemProviderCommissionRefundMaybe: prints the amount of refunded provider commission
   *
   * LineItemTotalPrice: prints total price of the transaction
   *
   */

  // Customize lines for different rental type

  let timeBasedLine = null;
  if(currentRentalType === 'hourly') {
    timeBasedLine = <LineItemBookingHours transaction={transaction} booking={booking} unitType={unitType} />
  } else if(currentRentalType === 'daily') {
    timeBasedLine = <LineItemBookingDays currentRentalType={currentRentalType} transaction={transaction} booking={booking} unitType={unitType} />
  } else if(currentRentalType === 'monthly') {
    timeBasedLine = <LineItemBookingDays currentRentalType={currentRentalType} transaction={transaction} booking={booking} unitType={unitType} />
  }

  return (
    <div className={classes}>

      {timeBasedLine}

      <h2>
        LineItemCustomPrices
      </h2>
      <LineItemCustomPrices
        transaction={transaction}
        currentUser={currentUser}         
        intl={intl} 
        unitType={unitType} 
      />
      
      <h2>
        LineItemSubTotalMaybe 
      </h2>
      <LineItemSubTotalMaybe
        transaction={transaction}
        unitType={unitType}
        userRole={userRole}
        intl={intl}
      />
      <h2>LineItemRefundMaybe</h2>
      <LineItemRefundMaybe transaction={transaction} unitType={unitType} intl={intl} />

      <h2>LineItemCustomerCommissionMaybe</h2>
      <LineItemCustomerCommissionMaybe
        transaction={transaction}
        isCustomer={isCustomer}
        intl={intl}
      />
      <h2>LineItemCustomerCommissionRefundMaybe</h2>
      <LineItemCustomerCommissionRefundMaybe
        transaction={transaction}
        isCustomer={isCustomer}
        intl={intl}
      />
      <h2>LineItemProviderCommissionMaybe</h2>
      <LineItemProviderCommissionMaybe
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
      />
      <h2>LineItemProviderCommissionRefundMaybe</h2>
      <LineItemProviderCommissionRefundMaybe
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
      />
      <h2>LineItemTotalPrice</h2>
      <LineItemTotalPrice transaction={transaction} currentUser={currentUser} isProvider={isProvider} intl={intl} />

      {hasCommissionLineItem ? (
          <span className={css.feeInfo}>
          <FormattedMessage id="BookingBreakdown.commissionFeeNote" />
        </span>
        ) : null}
    </div>
  );
};

BookingBreakdownComponent.defaultProps = { rootClassName: null, className: null, dateType: null };

BookingBreakdownComponent.propTypes = {
  rootClassName: string,
  className: string,

  userRole: oneOf(['customer', 'provider']).isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,

  // from injectIntl
  intl: intlShape.isRequired,
};

const BookingBreakdown = injectIntl(BookingBreakdownComponent);

BookingBreakdown.displayName = 'BookingBreakdown';

export default BookingBreakdown;


