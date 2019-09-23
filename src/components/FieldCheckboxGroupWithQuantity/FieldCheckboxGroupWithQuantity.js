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

import css from './FieldCheckboxGroupWithQuantity.css';

const FieldCheckboxRenderer = props => {
  const { className, 
    rootClassName, 
    label, 
    twoColumns, 
    id, 
    fields, 
    options, 
    meta } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
              />
              <FieldQuantityInput
                id={`${fieldId}_quantity`}
                type="number"
                min="1"
                max="100" // TO DO
                name={`${option.key}_quantity`}
                value="1"
              />
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
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
