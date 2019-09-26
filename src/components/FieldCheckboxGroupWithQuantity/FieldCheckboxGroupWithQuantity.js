import React, { Component } from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError, FieldQuantityInput, FieldCheckboxGroup } from '../../components';
import * as validators from '../../util/validators';
import { FormattedMessage } from '../../util/reactIntl';

import css from './FieldCheckboxGroupWithQuantity.css';

class FieldCheckboxGroupWithQuantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: this.props.selectedWorkspaces,
    };
  }

  shouldComponentUpdate(nextProps, nextState){
    return true
  }

  componentDidUpdate(prevProps){
    if(prevProps.selectedWorkspaces !== this.props.selectedWorkspaces){
      this.setState({
        selectedOptions: this.props.selectedWorkspaces
      })
    };
  }

  render() {
    const {
      twoColumns, 
      id, 
      options,
      intl,
      quantityErrors,
      defaultMaxQuantity,
    } = this.props;

    console.log("props", this.props);

    const selectedValues = this.state.selectedOptions;

    const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

    const quantityErrorsText = quantityErrors ? quantityErrors.map(function(item){
      return (
        <div className={css.quantityErrorText}>
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
              validate={validators.requiredFieldArrayCheckbox(workspacesRequiredMessage)}
            />
          </div>
          <div>
            <label className={css.labelQuantity}>{labelQ}</label>
            <ul className={listClasses}>
              {options.map((option, index) => {
                const maxQuantity = defaultMaxQuantity ? defaultMaxQuantity[option.key] : option.count;
                const fieldId = `${id}.${option.key}`;
                const quantityRequiredFunc = validators.requiredQuantity(`Value must be from ${1} to ${maxQuantity}`, 1, maxQuantity)
                const quantityRequired = selectedValues.indexOf(option.key) != -1 ? quantityRequiredFunc : false;
                return (
                  <li key={fieldId} className={css.item}>
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
          </div>
        </div>
        {/* <ValidationError fieldMeta={{ ...meta }} /> */}
        {quantityErrorsText}
      </div>

      // <FieldCheckboxGroup
      //   id={fieldId}
      //   name={fields.name}
      //   label={option.label}
      //   value={option.key}
      //   validate={validators.requiredFieldArrayCheckbox(workspacesRequiredMessage)}
      // />

      // <fieldset className={classes}>
      //   <div className={css.label}>
      //     <span>{labelW}</span>
      //     <span>{labelQ}</span>
      //   </div>
      //   <ul className={listClasses}>
      //     {options.map((option, index) => {
      //       const maxQuantity = defaultMaxQuantity ? defaultMaxQuantity[option.key] : option.count;
      //       const fieldId = `${id}.${option.key}`;
      //       const quantityRequiredFunc = validators.requiredQuantity(`Value must be from ${1} to ${maxQuantity}`, 1, maxQuantity)
      //       const quantityRequired = selectedValues.indexOf(option.key) != -1 ? quantityRequiredFunc : false;
      //       return (
      //         <li key={fieldId} className={css.item}>
      //           <FieldQuantityInput
      //             id={`${fieldId}_quantity`}
      //             type="number"
      //             // max={maxQuantity}
      //             name={`${option.key}_quantity`}
      //             validate={quantityRequired}
      //           />
      //         </li>
      //       );
      //     })}
      //   </ul>
      // </fieldset>
    );
  }
};

// FieldCheckboxGroupWithQuantity.defaultProps = {
//   rootClassName: null,
//   className: null,
//   label: null,
//   twoColumns: false,
// };

// FieldCheckboxGroupWithQuantityr.propTypes = {
//   rootClassName: string,
//   className: string,
//   id: string.isRequired,
//   label: node,
//   options: arrayOf(
//     shape({
//       key: string.isRequired,
//       label: node.isRequired,
//     })
//   ).isRequired,
// };


export default FieldCheckboxGroupWithQuantity;
