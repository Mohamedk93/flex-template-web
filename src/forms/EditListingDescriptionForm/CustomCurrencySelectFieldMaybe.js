import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.css';

const CustomCurrencySelectFieldMaybe = props => {
  const { name, id, currencies, intl, validate } = props;
  const currencyLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.currencyLabel',
  });
  const currencyPlaceholder = intl.formatMessage({
    id: 'EditListingDescriptionForm.currencyPlaceholder',
  });
  const currencyRequired = required(
    intl.formatMessage({
      id: 'EditListingDescriptionForm.currencyRequired',
    })
  );

  return currencies ? (
    <FieldSelect
      className={css.currency}
      name={name}
      id={id}
      validate={currencyRequired}
      label={currencyLabel}
    >
      <option disabled value="">
        {currencyPlaceholder}
      </option>
      {currencies.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCurrencySelectFieldMaybe;
