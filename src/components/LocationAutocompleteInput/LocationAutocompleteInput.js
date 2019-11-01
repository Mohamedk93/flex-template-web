import React, { Component } from 'react';
import { func, object, shape, string } from 'prop-types';
import { Field } from 'react-final-form';
import { ValidationError } from '../../components';
import LocationAutocompleteInputImpl from './LocationAutocompleteInputImpl.js';
import config from '../../config';

class LocationAutocompleteInputComponent extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return true
  };

  componentDidUpdate(prevProps, prevState){
    if(prevProps.valueFromForm !== this.props.valueFromForm){

      const { getLocationPoint, input, valueFromForm } = this.props;
      const value = typeof valueFromForm !== 'undefined' ? valueFromForm : input.value;
      
      const coords = value &&
      value.selectedPlace &&
      value.selectedPlace.origin ?
      value.selectedPlace.origin : null;

      const updateForm = false;
      const updateMap = true;

      if(coords) {
        getLocationPoint(coords, updateForm, updateMap);
      }

    };
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { rootClassName, getLocationPoint, labelClassName, ...restProps } = this.props;
    const { input, label, meta, valueFromForm, ...otherProps } = restProps;
    /* eslint-enable no-unused-vars */

    const value = typeof valueFromForm !== 'undefined' ? valueFromForm : input.value;
    
    const locationAutocompleteProps = { label, meta, ...otherProps, input: { ...input, value } };
    const labelInfo = label ? (
      <label className={labelClassName} htmlFor={input.name}>
        {label}
      </label>
    ) : null;

    return (
      <div className={rootClassName}>
        {labelInfo}
        <LocationAutocompleteInputImpl {...locationAutocompleteProps} />
        <ValidationError fieldMeta={meta} />
      </div>
    );
  }
}

LocationAutocompleteInputComponent.defaultProps = {
  rootClassName: null,
  labelClassName: null,
  type: null,
  label: null,
};

LocationAutocompleteInputComponent.propTypes = {
  rootClassName: string,
  labelClassName: string,
  input: shape({
    onChange: func.isRequired,
    name: string.isRequired,
  }).isRequired,
  label: string,
  meta: object.isRequired,
};

export default LocationAutocompleteInputImpl;

export const LocationAutocompleteInputField = props => {
  return <Field component={LocationAutocompleteInputComponent} {...props} />;
};
