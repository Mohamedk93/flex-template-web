/**
 * CurrencyInput renders an input field that format it's value according to currency formatting rules
 * onFocus: renders given value in unformatted manner: "9999,99"
 * onBlur: formats the given input: "9 999,99 €"
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from '../../util/reactIntl';
import { PRICING_LOCAL_NAMES } from '../../util/dates';

import { Field } from 'react-final-form';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import { ValidationError } from '../../components';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  isSafeNumber,
  unitDivisor,
  convertUnitToSubUnit,
  convertMoneyToNumber,
  ensureDotSeparator,
  ensureSeparator,
  truncateToSubUnitPrecision,
} from '../../util/currency';
import { propTypes } from '../../util/types';
import * as log from '../../util/log';

import css from './FieldCurrencyInput.css';

const { Money } = sdkTypes;

const allowedInputProps = allProps => {
  // Strip away props that are not passed to input element (or are overwritten)
  // eslint-disable-next-line no-unused-vars
  const { currencyConfig, defaultValue, intl, input, meta, ...inputProps } = allProps;
  return inputProps;
};
const MAX_MOBILE_SCREEN_WIDTH = 768;
const isMobile = typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH


// Convert unformatted value (e.g. 10,00) to Money (or null)
const getPrice = (unformattedValue, currencyConfig) => {
  const isEmptyString = unformattedValue === '';
  try {
    return isEmptyString
      ? null
      : new Money(
          convertUnitToSubUnit(unformattedValue, unitDivisor(currencyConfig.currency), false, false),
          currencyConfig.currency
        );
  } catch (e) {
    return null;
  }
};

class CurrencyInputComponent extends Component {
  constructor(props) {
    super(props);
    const { currencyConfig, defaultValue, input, intl, rates, currency } = props;
    const initialValueIsMoney = input.value instanceof Money;
  
    const result = rates.find(e => e.iso_code == currency);
    const initialValue = initialValueIsMoney ? convertMoneyToNumber(input.value) : defaultValue;
    const hasInitialValue = typeof initialValue === 'number' && !isNaN(initialValue);
    const newInitialValue = result && initialValue ? initialValue.toString() * result.current_rate : '';
    // We need to handle number format - some locales use dots and some commas as decimal separator
    // TODO Figure out if this could be digged from React-Intl directly somehow
    const testSubUnitFormat = intl.formatNumber('1.1', currencyConfig.config);
    const usesComma = testSubUnitFormat.indexOf(',') >= 0;
    try {
      // whatever is passed as a default value, will be converted to currency string
      // Unformatted value is digits + localized sub unit separator ("9,99")
      let unformattedValue = hasInitialValue
        ? newInitialValue ? newInitialValue.toFixed(2) : ''
        : '';
      // Formatted value fully localized currency string ("$1,000.99")
      let formattedValue = hasInitialValue
        ? intl.formatNumber(ensureDotSeparator(unformattedValue), currencyConfig)
        : '';
      formattedValue = result? formattedValue.replace('$', result.symbol) : formattedValue;
      this.state = {
        formattedValue,
        unformattedValue,
        value: formattedValue,
        usesComma,
      };
    } catch (e) {
      log.error(e, 'currency-input-init-failed', { currencyConfig, defaultValue, initialValue });
      throw e;
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.updateValues = this.updateValues.bind(this);
  }

  onInputChange(event) {
    event.preventDefault();
    event.stopPropagation();
    // Update value strings on state
    let { unformattedValue, tmpPrice } = this.updateValues(event);
    // Notify parent component about current price change
    let price = getPrice(ensureDotSeparator(unformattedValue), this.props.currencyConfig);
    if(tmpPrice && price){
      tmpPrice = tmpPrice * 100;
      price.amount = tmpPrice;
    }

    this.props.input.onChange(price);
  }

  onInputBlur(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      currencyConfig,
      input: { onBlur },
    } = this.props;
    this.setState(prevState => {
      if (onBlur) {
        // If parent component has provided onBlur function, call it with current price.
        const price = getPrice(ensureDotSeparator(prevState.unformattedValue), currencyConfig);
        onBlur(price);
      }
      return {
        value: prevState.formattedValue,
      };
    });
  }

  onInputFocus(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      currencyConfig,
      input: { onFocus },
    } = this.props;
    this.setState(prevState => {
      if (onFocus) {
        // If parent component has provided onFocus function, call it with current price.
        const price = getPrice(ensureDotSeparator(prevState.unformattedValue), currencyConfig);
        onFocus(price);
      }
      return {
        value: prevState.unformattedValue,
      };
    });
  }

  updateValues(event) {
    try {
      const { currencyConfig, intl } = this.props;
      const result = this.props.rates.find(e => e.iso_code == this.props.currency);
      const targetValue = event.target.value.trim();
      const isEmptyString = targetValue === '';
      const valueOrZero = isEmptyString ? '0' : targetValue;
      let tmpPrice = null;

      const targetDecimalValue = isEmptyString
        ? null
        : new Decimal(ensureDotSeparator(targetValue));

      const isSafeValue =
        isEmptyString || (targetDecimalValue.isPositive() && isSafeNumber(targetDecimalValue));
      if (!isSafeValue) {
        throw new Error(`Unsafe money value: ${targetValue}`);
      }

      // truncate decimals to subunit precision: 10000.999 => 10000.99
      const truncatedValueString = truncateToSubUnitPrecision(
        valueOrZero,
        unitDivisor(currencyConfig.currency),
        this.state.usesComma
      );
      let unformattedValue = !isEmptyString ? truncatedValueString : '';
      let formattedValue = !isEmptyString
        ? intl.formatNumber(ensureDotSeparator(truncatedValueString), currencyConfig)
        : '';
      
      formattedValue = result ? formattedValue.replace('$', result.symbol) : formattedValue; 
      this.setState({
        formattedValue,
        value: unformattedValue,
        unformattedValue,
      });
        
      if(result){
        unformattedValue = unformattedValue / result.current_rate;
        tmpPrice = unformattedValue.toFixed(5);
        unformattedValue = truncateToSubUnitPrecision(
          unformattedValue,
          unitDivisor(currencyConfig.currency),
          this.state.usesComma
        );
      }
      if(typeof window !== 'undefined'){
        localStorage.setItem(this.props.input.name, tmpPrice * 100);
        const index = PRICING_LOCAL_NAMES.findIndex( value => { return value == this.props.input.name } );
        if(index !== -1){
          localStorage.setItem('currentIndex', index);
        }
      }
      return { formattedValue, value: unformattedValue, unformattedValue, tmpPrice};
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      // If an error occurs while filling input field, use previous values
      // This ensures that string like '12.3r' doesn't end up to a state.
      const { formattedValue, unformattedValue, value } = this.state;
      return { formattedValue, unformattedValue, value };
    }
  }

  render() {
    const { className, currencyConfig, defaultValue, placeholder, intl } = this.props;
    const placeholderText = placeholder || intl.formatNumber(defaultValue, currencyConfig);
    return (
      <input
        className={className}
        {...allowedInputProps(this.props)}
        value={this.state.value}
        onChange={this.onInputChange}
        onBlur={this.onInputBlur}
        onFocus={this.onInputFocus}
        type="text"
        placeholder={placeholderText}
      />
    );
  }
}

CurrencyInputComponent.defaultProps = {
  className: null,
  currencyConfig: null,
  defaultValue: null,
  input: null,
  placeholder: null,
};

const { func, oneOfType, number, shape, string, object } = PropTypes;

CurrencyInputComponent.propTypes = {
  className: string,
  currencyConfig: propTypes.currencyConfig.isRequired,
  defaultValue: number,
  intl: intlShape.isRequired,
  input: shape({
    value: oneOfType([string, propTypes.money]),
    onBlur: func,
    onChange: func.isRequired,
    onFocus: func,
  }).isRequired,

  placeholder: string,
};

export const CurrencyInput = injectIntl(CurrencyInputComponent);

const FieldCurrencyInputComponent = props => {
  const { rootClassName, className, authorProfile, userInfo, id, label, input, meta, ...rest } = props;
  if (label && !id) {
    throw new Error('id required when a label is given');
  }

  const { valid, invalid, touched, error } = meta;

  // Error message and input error styles are only shown if the
  // field has been touched and the validation has failed.
  const hasError = touched && invalid && error;

  const inputClasses = classNames(css.input, {
    [css.inputSuccess]: valid,
    [css.inputError]: hasError,
  });
  const rates = authorProfile.protectedData.rates;
  const currency = userInfo; 
  const inputProps = { className: inputClasses, id, input, rates, currency, ...rest };
  
  const classes = classNames(rootClassName, className);
  return (
    <div className={classes}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <CurrencyInput {...inputProps} />
      <ValidationError fieldMeta={meta} />
    </div>
  );
};

FieldCurrencyInputComponent.defaultProps = {
  rootClassName: null,
  className: null,
  id: null,
  label: null,
};

FieldCurrencyInputComponent.propTypes = {
  rootClassName: string,
  className: string,

  // Label is optional, but if it is given, an id is also required so
  // the label can reference the input in the `for` attribute
  id: string,
  label: string,

  // Generated by final-form's Field component
  input: object.isRequired,
  meta: object.isRequired,
};

const FieldCurrencyInput = props => {
  return <Field component={FieldCurrencyInputComponent} {...props} />;
};

export default FieldCurrencyInput;
