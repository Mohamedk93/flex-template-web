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
      console.log(this.props);
      const { setAdditionalGeodata, input, valueFromForm } = this.props;
      const value = typeof valueFromForm !== 'undefined' ? valueFromForm : input.value;
      
      const locationCoord = value &&
      value.selectedPlace &&
      value.selectedPlace.origin ?
      value.selectedPlace.origin : null;
      
      if(locationCoord) {
        const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationCoord.lat},${locationCoord.lng}&key=${config.maps.googleMapsAPIKey}`
        fetch(requestUrl)
          .then(response => response.json())
          .then(data => {
            const address = data &&
              data.results &&
              data.results[0] &&
              data.results[0].address_components ?
              data.results[0].address_components : null;

            const country = address ? address.filter(function(item){
              return item.types.indexOf("country") !== -1
            }) : null;
            const countryName = country ? country[0].long_name : null;

            const city = address ? address.filter(function(item){
              return item.types.indexOf("locality") !== -1
            }) : null;
            const cityName = city ? city[0].long_name : null;

            console.log("data", countryName, cityName);
            setAdditionalGeodata({
              city: cityName,
              country: countryName,
            })
          })
          .catch(error => {console.log(error)});
      };
    };
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { rootClassName, setAdditionalGeodata, labelClassName, ...restProps } = this.props;
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
