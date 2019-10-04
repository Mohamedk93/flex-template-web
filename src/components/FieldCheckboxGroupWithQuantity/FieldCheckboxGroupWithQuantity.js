import React, { Component } from 'react';
import { string, arrayOf, shape, node } from 'prop-types';
import { FieldQuantityInput, FieldCheckboxGroup } from '../../components';
import { requiredFieldArrayCheckbox } from '../../util/validators';
import css from './FieldCheckboxGroupWithQuantity.css';

const guid = () =>
  `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

class FieldCheckboxGroupWithQuantity extends Component {
  render() {

    const {
      id, 
      options,
      intl,
      quantityErrors,
    } = this.props;

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
      <div>
        <div className={css.twoColumnWQ}>
          <div>
            <FieldCheckboxGroup
              id="workspaces"
              name="workspaces"
              label={labelW}
              options={options}
              validate={requiredFieldArrayCheckbox(workspacesRequiredMessage)}
            />
          </div>
          <div>
            <label className={css.labelQuantity}>{labelQ}</label>
            <ul className={css.list}>
              {options.map((option) => {
                const fieldId = `${id}.${option.key}`;
                return (
                  <li key={fieldId} className={css.item}>
                    <FieldQuantityInput
                      id={`${fieldId}_quantity`}
                      type="number"
                      name={`${option.key}_quantity`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {quantityErrorsText}
      </div>
    );
  }
};

FieldCheckboxGroupWithQuantity.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
};

FieldCheckboxGroupWithQuantity.propTypes = {
  rootClassName: string,
  className: string,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
};

export default FieldCheckboxGroupWithQuantity;
