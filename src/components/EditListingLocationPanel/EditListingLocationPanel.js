import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { EditListingLocationForm } from '../../forms';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import filter from 'lodash/filter';

import css from './EditListingLocationPanel.css';

const { LatLng } = sdkTypes;

function getMapDataByTypes(geodata, types) {

  const gmItem = filter(geodata, (item) => {
    const components = filter(item.address_components, (subitem) => {
      return (subitem.types.indexOf(types) !== -1)
    });
    return (components.length !== 0);
  });

  let gmItemFormat = [];
  if(gmItem.length !== 0) {
    gmItemFormat = filter(gmItem[0].address_components, (item) => {
      return (item.types.indexOf(types) !== -1)
    }); 
  };

  let result = (gmItemFormat.length !== 0) ? gmItemFormat[0].long_name : null

  return result

};

class EditListingLocationPanel extends Component {
  constructor(props) {
    super(props);  
    
    this.state = {
      initialValues: this.getInitialValues(),

      city: this.getInitialCustomValues('city'),
      country: this.getInitialCustomValues('country'),
      coords: this.getInitialCoords(),
      updateMap: false,
    };

    this.getInitialCoords = this.getInitialCoords.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.getLocationPoint = this.getLocationPoint.bind(this);
    this.setNewInitialValues = this.setNewInitialValues.bind(this);
    this.getInitialCustomValues = this.getInitialCustomValues.bind(this);
  }

  getInitialValues() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation, publicData } = currentListing.attributes;

    // Only render current search if full place object is available in the URL params
    // TODO bounds are missing - those need to be queried directly from Google Places
    const locationFieldsPresent =
      publicData && publicData.location && publicData.location.address && geolocation;
    const location = publicData && publicData.location ? publicData.location : {};
    const { address, building } = location;

    return {
      building,
      location: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin: geolocation },
          }
        : null,
    };
  }

  getInitialCustomValues(param) {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { publicData } = currentListing.attributes;
    const value = publicData ? publicData[param] : null;
    return value
  }

  setNewInitialValues(coords, formattedAddress) {

    const building = this.state.initialValues.building;
    const coordsObj = new LatLng(coords.lat, coords.lng);
    const address = formattedAddress ? formattedAddress : "";

    const initialValues = {
      building,
      location: {
        search: address,
        selectedPlace: { 
          address: address, 
          origin: coordsObj,
        },
      },
    }

    this.setState({
      initialValues
    })

  }

  getInitialCoords() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation } = currentListing.attributes;

    const coords = {
      lat: geolocation ? geolocation.lat : 30.03,
      lng: geolocation ? geolocation.lng : 31.24,
    }

    return coords
  }

  getLocationPoint(coords, updateForm = false, updateMap = false) { 
    // const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&language=en&result_type=locality&result_type=country&result_type=street_address&key=${config.maps.googleMapsAPIKey}`
    const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&language=en&key=${config.maps.googleMapsAPIKey}`
    fetch(requestUrl)
      .then(response => response.json())
      .then(data => {

        const geodata = data ? data.results : null;

        const city = getMapDataByTypes(geodata, 'locality');
        const country = getMapDataByTypes(geodata, 'country');

        const formattedAddress = data &&
          data.results &&
          data.results[0] &&
          data.results[0].formatted_address ?
          data.results[0].formatted_address : null;

        // const address = data &&
        //   data.results &&
        //   data.results[0] &&
        //   data.results[0].address_components ?
        //   data.results[0].address_components : null;

        // const city = address ? address.filter(function(item){
        //   return item.types.indexOf("locality") !== -1
        // }) : null;
        // const cityString = city.length !== 0 ? city[0].long_name : null;

        // const country = address ? address.filter(function(item){
        //   return item.types.indexOf("country") !== -1
        // }) : null;
        // const countryString = country.length !== 0 ? country[0].long_name : null;

        this.setState({ 
          city,
          country,
          coords,
        });

        if(updateForm) {
          this.setNewInitialValues(coords, formattedAddress);
        };

        if(updateMap) {
          this.setState({
            updateMap: !this.state.updateMap
          });
        };

      })
      .catch(error => {console.log(error)});
  }

  onMarkerDragEnd(coordsObj) {
    const { latLng } = coordsObj;
    const coords = { 
      lat: latLng.lat, 
      lng: latLng.lng,
    };
    const updateForm = true;
    this.getLocationPoint(coords, updateForm);
  }

  render() {
    const {
      className,
      rootClassName,
      listing,
      onSubmit,
      onChange,
      submitButtonText,
      panelUpdated,
      updateInProgress,
      errors,
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);
    const currentListing = ensureOwnListing(listing);

    const isPublished =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = isPublished ? (
      <FormattedMessage
        id="EditListingLocationPanel.title"
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    ) : (
      <FormattedMessage id="EditListingLocationPanel.createListingTitle" />
    );

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditListingLocationForm
          className={css.form}
          initialValues={this.state.initialValues}
          onSubmit={values => {
            const { building = '', location } = values;
            const {
              selectedPlace: { address, origin },
            } = location;
            const updateValues = {
              geolocation: origin,
              publicData: {
                location: { 
                  address, 
                  building,
                },
                city: this.state.city,
                country: this.state.country,
              },
            };
            this.setState({
              initialValues: {
                building,
                location: { search: address, selectedPlace: { address, origin } },
              },
            });
            onSubmit(updateValues);
          }}
          onChange={onChange}
          saveActionMsg={submitButtonText}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          getLocationPoint={this.getLocationPoint}
          coords={this.state.coords}
          city={this.state.city}
          onMarkerDragEnd={this.onMarkerDragEnd}
          updateMap={this.state.updateMap}
        />
      </div>
    );
  }
}

const { func, object, string, bool } = PropTypes;

EditListingLocationPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingLocationPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingLocationPanel;
