/*
 * Renders a group of checkboxes with quantity fields that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError, FieldQuantityInput } from '../../components';
import * as validators from '../../util/validators';
import { FormattedMessage } from '../../util/reactIntl';

import css from './FieldCheckboxGroupWithQuantity.css';

const guid = () =>
  `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;


const FieldCheckboxRenderer = props => {
  const { className, 
    rootClassName, 
    label, 
    twoColumns, 
    id, 
    fields, 
    options,
    intl,
    quantityErrors,
    defaultMaxQuantity,
    meta } = props;

  const selectedValues = fields.value ? fields.value : [];

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  const quantityErrorsText = quantityErrors ? quantityErrors.map(function(item){
    return (
      <div className={css.quantityErrorText} key={guid()}>
        {item}
      </div>
    )
  }) : null;

  const labelW = intl.formatMessage({
    id: 'EditListingDescriptionForm.workspacesLabel',
  });
  const labelQ = intl.formatMessage({
    id: 'EditListingDescriptionForm.quantityLabel',
  });

  const workspacesRequiredMessage = intl.formatMessage({
    id: 'EditListingDescriptionForm.workspacesRequiredMessage',
  });

  return (
    <fieldset className={classes}>
      <div className={css.label}>
        <span>{labelW}</span>
        <span>{labelQ}</span>
      </div>
      <ul className={listClasses}>
        {options.map((option, index) => {
          const maxQuantity = defaultMaxQuantity ? defaultMaxQuantity[option.key] : option.count;
          const fieldId = `${id}.${option.key}`;
          const quantityRequiredFunc = validators.requiredQuantity(`${option.label} value must be from ${1} to ${maxQuantity}`, 1, maxQuantity)
          const quantityRequired = selectedValues.indexOf(option.key) != -1 ? quantityRequiredFunc : false;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
                validate={validators.requiredFieldArrayCheckbox(workspacesRequiredMessage)}
              />
              <FieldQuantityInput
                id={`${fieldId}_quantity`}
                type="number"
                name={`${option.key}_quantity`}
                validate={quantityRequired}
              />
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
      {quantityErrorsText}
    </fieldset>
  );
};

FieldCheckboxRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldCheckboxRenderer.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const FieldCheckboxGroupWithQuantity = props => <FieldArray component={FieldCheckboxRenderer} {...props} />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
FieldCheckboxGroupWithQuantity.propTypes = {
  name: string.isRequired,
};

export default FieldCheckboxGroupWithQuantity;
