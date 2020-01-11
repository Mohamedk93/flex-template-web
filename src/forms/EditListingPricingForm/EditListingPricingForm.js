import React from 'react';
import { bool, func, shape, string, array } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldCheckbox, FieldSelect } from '../../components';
import css from './EditListingPricingForm.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
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
        rates,
        updateInProgress,
        fetchErrors,
        workspaces,
        rentalTypes,
      } = fieldRenderProps;

      const unitType = config.bookingUnitType;
      const isNightly = unitType === LINE_ITEM_NIGHT;
      const isDaily = unitType === LINE_ITEM_DAY;
      console.log('This is props');
      console.log(props);
      const translationKey = isNightly
        ? 'EditListingPricingForm.pricePerNight'
        : isDaily
        ? 'EditListingPricingForm.pricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const pricePerUnitMessage = intl.formatMessage({
        id: translationKey,
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const priceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.priceRequired',
        })
      );

      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};
      const labelText = intl.formatMessage({ id: 'EditListingPricingForm.enable_quick_rent' });
      const capacityPlaceholder = intl.formatMessage({
        id: 'EditListingPricingForm.defaultCurrency',
      });
      const priceHead = rentalTypes.map(item => {
        const rentalLabel = intl.formatMessage({
          id: `EditListingPricingForm.rentalType_${item}`,
        });
        return (
          <div className={css.rentalLables} key={item}>
            {rentalLabel}
          </div>
        )
      });

      const priceTable = workspaces.map(price => {

        const priceLabel = intl.formatMessage({
          id: `EditListingPricingForm.priceLabel_${price}`,
        });

        const priceFields = rentalTypes.map(item => {
          const fieldId = `price_${price}_${item}`;
          return (
            <div className={css.priceField} key={fieldId}>
              <FieldCurrencyInput
                id={fieldId}
                name={fieldId}
                key={fieldId}
                className={css.priceInput}
                placeholder={pricePlaceholderMessage}
                currencyConfig={config.currencyConfig}
                validate={priceValidators}
              />
            </div>
          )
        });

        return (
          <div className={css.priceRow} key={price}>
            <div className={css.priceLabel}>
              {priceLabel}
            </div>
            <div className={css.priceFields}>
              {priceFields}
            </div>
          </div>
        )
      });

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          <p className={css.priceGeneral}>
            <FormattedMessage id="EditListingPricingForm.priceGeneral" />
          </p>

          <FieldSelect
            name="rates"
            id="rates"
          >
            <option value="">{capacityPlaceholder}</option>
            {rates.map(c => (
              <option key={c.iso_code} value={c.isdo_code}>
                {c.iso_code}
              </option>
            ))}
          </FieldSelect>

          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}
          <div className={css.priceTableWrapper}>
            <div className={css.priceHead}>
              {priceHead}
            </div>
            <div className={css.priceTable}>
              {priceTable}
            </div>
          </div>

          <FieldCheckbox
            id="quickRent"
            name="quickRent"
            className={css.title}
            label={labelText}
            value='quickRent'
          />
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

EditListingPricingFormComponent.defaultProps = { 
  fetchErrors: null,
  workspaces: [],
  rentalTypes: [],
  rates: config.custom.rates,
};

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  quickRent: bool,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  workspaces: array.isRequired,
  rentalTypes: array.isRequired,
  rates: array,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
