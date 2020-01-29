import React, {useState} from 'react';
import { bool, func, shape, string, array } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { required } from '../../util/validators';

import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldCheckbox, FieldSelect } from '../../components';
import css from './EditListingPricingForm.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => {
  let [userInfo, setUserInfo] = useState(props.initialValues.rates);
  let [rate, setRate] = useState(props.initialValues.rate);
  
  return (
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
      const authorProfile = props.initialValues.author.attributes.profile;
      const currentUser = props.initialValues.currentUser;
      let rate = props.initialValues.rates;
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
      const requiredSelect = required('This field is required');
      
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
                authorProfile={authorProfile}
                userInfo={userInfo}
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
      console.log('This is rate ==>', rate)
      return (
        <Form onSubmit={handleSubmit} className={classes}>
          
          <div className={css.inlineDiv}>
            <span>Pricing in</span> 
            <FieldSelect
              name="rates"
              id="rates"
              validate={requiredSelect}
              onClick={e => {
                setRate(
                  e.target.value
                )}}
            >
              <option value={rate}>{rate}</option> 
              {rates.map(c => (
                <option key={c.iso_code} value={c.iso_code}>
                  {c.iso_code}
                </option>
              ))}
            </FieldSelect>
            <span>for different types of rental</span>
          </div>
         


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
  }

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
  rates: array.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
