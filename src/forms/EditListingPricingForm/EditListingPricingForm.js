import React, {useState} from 'react';
import {bool, func, shape, string, array, arrayOf} from 'prop-types';
import {compose} from 'redux';
import {Form as FinalForm, FormSpy} from 'react-final-form';
import {intlShape, injectIntl, FormattedMessage} from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import {LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes} from '../../util/types';
import { mainMobileArray, setMobileArray, sortArray } from '../../util/dates';

import * as validators from '../../util/validators';
import {required} from '../../util/validators';
import arrayMutators from 'final-form-arrays';

import {formatMoney} from '../../util/currency';
import {types as sdkTypes} from '../../util/sdkLoader';
import {Button, Form, FieldCurrencyInput, FieldCheckbox, FieldSelect} from '../../components';
import css from './EditListingPricingForm.css';
import { format } from 'path';

const {Money} = sdkTypes;
const MAX_MOBILE_SCREEN_WIDTH = 768;
const isMobile = typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH

export const EditListingPricingFormComponent = props => (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
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
          currencies,
          updateInProgress,
          fetchErrors,
          workspaces,
          rentalTypes,
          values,
        } = fieldRenderProps;
        
        const unitType = config.bookingUnitType;
        const isNightly = unitType === LINE_ITEM_NIGHT;
        const isDaily = unitType === LINE_ITEM_DAY;
        const currentUser = props.initialValues.currentUser; 
        const authorProfile = props.initialValues.author ? props.initialValues.author.attributes.profile : '';
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

        let minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
        let symbol = null;
        let formarMinPrice = minPrice;
        if(currentUser && values && values.currency){
          let currency = values.currency.toUpperCase();
          let rates = currentUser.attributes.profile.protectedData.rates;
          const result = rates.find(e => e.iso_code == currency);
          if(result){
            const amount = formarMinPrice.amount;
            formarMinPrice.amount = amount * result.current_rate / 100;
            formarMinPrice.currency = currency;
            symbol = result.symbol;
          }
        }
        const priceInfo = !symbol ? formatMoney(intl, minPrice) : `${formarMinPrice.amount.toFixed(2)} ${symbol}`;
        const count = 0;
        const trueCount= 0;
        const blockCount = 0;
        let isSubmit = true;
        let mobileArray = [];
        let oldMobileArray = []
        if(typeof window !== 'undefined'){
          if(isMobile){
            mobileArray = mainMobileArray(props);
            oldMobileArray = setMobileArray(props);
          }
          if(localStorage.getItem('mobileButton') && localStorage.getItem('mobileButton').length > 0){
            isSubmit = localStorage.getItem('mobileButton');
          }
        }
        const minPriceRequired = validators.moneySubUnitAmountAtLeast(
          intl.formatMessage(
            {
              id: 'EditListingPricingForm.priceTooLow',
            },
            {
              minPrice:priceInfo,
            }
          ),
          config.listingMinimumPriceSubUnits,
          isMobile,
          count,
          trueCount,
          mobileArray,
          oldMobileArray,
        );
        const priceValidators = config.listingMinimumPriceSubUnits
          ? validators.composeValidators(priceRequired, minPriceRequired)
          : priceRequired;

        const classes = classNames(css.root, className);
        const submitReady = updated && pristine;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;
        const {updateListingError, showListingsError} = fetchErrors || {};
        const labelText = intl.formatMessage({id: 'EditListingPricingForm.enable_quick_rent'});
        const capacityPlaceholder = intl.formatMessage({
          id: 'EditListingPricingForm.defaultCurrency',
        });
        let sortArray = [];
        if(rentalTypes.indexOf('hourly') !== -1){
          sortArray.push("hourly");
        }
        if(rentalTypes.indexOf('daily') !== -1){
          sortArray.push("daily");
        }
        if(rentalTypes.indexOf('monthly') !== -1){
          sortArray.push("monthly");
        }

        const priceHead = sortArray.map(item => {
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

        const submitButton = isMobile ? (
          <Button
          className={css.submitButton}
          type="submit"
          inProgress={submitInProgress}
          disabled={ isSubmit ===  'false' ? true : false}
          ready={submitReady}
        >
          {saveActionMsg}
        </Button>
        ) :
        (
          <Button
          className={css.submitButton}
          type="submit"
          inProgress={submitInProgress}
          disabled={submitDisabled}
          ready={submitReady}
        >
          {saveActionMsg}
        </Button>
        ) 

        const priceTable = workspaces.map(price => {
          const priceLabel = intl.formatMessage({
            id: `EditListingPricingForm.priceLabel_${price}`,
          });
          
          const priceFields = sortArray.map(item => {
            const fieldId = `price_${price}_${item}`;
            return (
              <div className={css.priceField} key={fieldId}>
                <FieldCurrencyInput
                  id={fieldId}
                  name={fieldId}
                  key={fieldId}
                  authorProfile={authorProfile}
                  userInfo={values.currency.toUpperCase()}
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
          <Form onSubmit={handleSubmit}
                className={classes}
          >
            <div className={css.currencyHolder}>
              <span><FormattedMessage id="EditListingPricingForm.pricingSpan1"/></span>
              <span className={css.currencyName}>{values.currency.toUpperCase()}</span>
              <span><FormattedMessage id="EditListingPricingForm.pricingCurrency"/></span>
              <span><FormattedMessage id="EditListingPricingForm.pricingSpan2"/></span>
            </div>

            {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingPricingForm.updateFailed"/>
                </p>
              ) : null}

            {showListingsError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingPricingForm.showListingFailed"/>
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
              className={css.quickRent}
              label={labelText}
              value='quickRent'
            />
            {submitButton}
          </Form>
        );
      }}
    />
  );


EditListingPricingFormComponent.defaultProps = {

  fetchErrors: null,
  workspaces: [],
  rentalTypes: [],
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
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
